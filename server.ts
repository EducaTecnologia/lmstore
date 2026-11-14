import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  return {
    mimeType: 'image/jpeg',
    data: dataUrl.replace(/^data:image\/\w+;base64,/, ''),
  };
}

function formatGeminiErrorMessage(err: any): { status: number; message: string } {
  const raw = String(err?.message || err || '');
  const status = Number(err?.status || err?.code || 500);

  if (status === 403 || status === 400 || raw.includes('PERMISSION_DENIED') || raw.includes('API_KEY_INVALID') || raw.includes('API key not valid')) {
    return {
      status: status === 403 ? 403 : 400,
      message: 'Chave da API Gemini ausente ou inválida. Verifique a chave em Settings > Secrets.',
    };
  }
  if (status === 429 || raw.includes('RESOURCE_EXHAUSTED') || raw.includes('quota')) {
    return {
      status: 429,
      message: 'Limite de requisições ou cota da API Gemini excedido. Para modelos de geração de imagem, selecione uma chave com faturamento ativo em Settings > Secrets.',
    };
  }
  if (status === 404 || raw.includes('NOT_FOUND')) {
    return {
      status: 404,
      message: 'Modelo Gemini solicitado não encontrado ou indisponível no momento.',
    };
  }
  return {
    status: status >= 400 && status < 600 ? status : 500,
    message: raw || 'Erro ao processar solicitação com a IA Gemini.',
  };
}

async function generateEditedImageWithFallback(
  ai: GoogleGenAI,
  imageParts: Array<{ inlineData: { data: string; mimeType: string } }>,
  promptText: string,
  aspectRatio: '16:9' | '4:3' | '1:1' = '4:3'
): Promise<{ imageUrl: string; modelUsed: string }> {
  const modelsToTry = ['gemini-3.1-flash-lite-image', 'gemini-nano-banana-2.1'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[AI Image] Tentando modelo: ${model}`);
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [...imageParts, { text: promptText }],
        },
        config: {
          imageConfig: {
            aspectRatio,
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          return {
            imageUrl: `data:${mime};base64,${part.inlineData.data}`,
            modelUsed: model,
          };
        }
      }
    } catch (err: any) {
      console.warn(`[AI Image] Erro com modelo ${model}:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('Não foi possível gerar a imagem simulada.');
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '50mb' }));

  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY || '';
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Endpoint 1: Recolor Wall with Gemini AI
  app.post('/api/ai/recolor-wall', async (req, res) => {
    try {
      const { imageBase64, colorImageBase64, colorName, colorHex } = req.body;
      if (!imageBase64 || (!colorName && !colorImageBase64)) {
        return res.status(400).json({ error: 'Imagem da parede e cor (nome ou imagem) são obrigatórios.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Chave da API Gemini não configurada. Adicione GEMINI_API_KEY em Settings > Secrets.',
        });
      }

      const ai = getGenAI();
      const wallParsed = parseDataUrl(imageBase64);
      const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = [
        { inlineData: { data: wallParsed.data, mimeType: wallParsed.mimeType } },
      ];

      let promptText = `Repinte exclusivamente as paredes da primeira imagem com a cor "${colorName || 'exatamente igual à amostra da segunda imagem'}"${colorHex ? ` (referência hex ${colorHex})` : ''}. Preserve perfeitamente a iluminação realista, sombras naturais, móveis, rodapés, tomadas, portas e janelas sem alterar a geometria do ambiente. Acabamento de tinta acrílica premium de altíssima fidelidade.`;

      if (colorImageBase64) {
        const swatchParsed = parseDataUrl(colorImageBase64);
        imageParts.push({ inlineData: { data: swatchParsed.data, mimeType: swatchParsed.mimeType } });
        promptText = `Use a segunda imagem como referência exata de cor de tinta e repinte exclusivamente as paredes da primeira imagem com essa tonalidade${colorName ? ` (${colorName})` : ''}. Preserve iluminação natural, móveis, tomadas, rodapés e objetos sem alterar.`;
      }

      const result = await generateEditedImageWithFallback(ai, imageParts, promptText, '4:3');

      return res.json({
        success: true,
        modelUsed: result.modelUsed,
        resultImage: result.imageUrl,
        colorName: colorName || 'Cor personalizada',
      });
    } catch (error: any) {
      console.error('Erro na rota /api/ai/recolor-wall:', error);
      const formatted = formatGeminiErrorMessage(error);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // API Endpoint 2: Simulate Material 3D Render
  app.post('/api/ai/simulate-material', async (req, res) => {
    try {
      const { imageBase64, materialImageBase64, materialName, customPrompt } = req.body;
      if (!imageBase64 || (!materialName && !materialImageBase64)) {
        return res.status(400).json({ error: 'Imagem do ambiente e material são obrigatórios.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Chave da API Gemini não configurada. Adicione GEMINI_API_KEY em Settings > Secrets.',
        });
      }

      const ai = getGenAI();
      const envParsed = parseDataUrl(imageBase64);
      const imageParts: Array<{ inlineData: { data: string; mimeType: string } }> = [
        { inlineData: { data: envParsed.data, mimeType: envParsed.mimeType } },
      ];

      let promptText = `Renderize uma simulação arquitetônica fotorrealista em alta definição aplicando "${materialName}" neste ambiente. ${customPrompt || ''}. Mantenha a perspectiva, iluminação natural, reflexos e elementos estruturais da cena com acabamento de alto padrão.`;

      if (materialImageBase64) {
        const matParsed = parseDataUrl(materialImageBase64);
        imageParts.push({ inlineData: { data: matParsed.data, mimeType: matParsed.mimeType } });
        promptText = `Aplique o piso/revestimento/material mostrado na segunda imagem diretamente na superfície apropriada (piso ou parede conforme indicado) da primeira imagem do ambiente${materialName ? ` (${materialName})` : ''}. ${customPrompt || ''}. Respeite rigorosamente a perspectiva, rejuntes, sombras, móveis existentes e iluminação natural do ambiente.`;
      }

      const result = await generateEditedImageWithFallback(ai, imageParts, promptText, '4:3');

      return res.json({
        success: true,
        modelUsed: result.modelUsed,
        resultImage: result.imageUrl,
        materialName: materialName || 'Material anexado',
      });
    } catch (error: any) {
      console.error('Erro na rota /api/ai/simulate-material:', error);
      const formatted = formatGeminiErrorMessage(error);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // API Endpoint 3: Unified Gemini Assistant Chat (Materials List, Room/Garage + Floor Simulation, Wall Paint + Simulation)
  app.post('/api/ai/assistant-chat', async (req, res) => {
    try {
      const {
        message = '',
        images = [],
        measurements,
        thinkingMode = false,
        catalogSummary = [],
        orderContext = {},
        history = [],
      } = req.body;

      if (!message.trim() && (!Array.isArray(images) || images.length === 0)) {
        return res.status(400).json({ error: 'Envie uma mensagem ou anexe pelo menos uma imagem.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
        return res.status(400).json({
          error: 'Chave da API Gemini não configurada. Configure GEMINI_API_KEY em Settings > Secrets para usar o Assistente Técnico LM Store.',
        });
      }

      const ai = getGenAI();

      const catalogText = Array.isArray(catalogSummary)
        ? catalogSummary
            .slice(0, 60)
            .map(
              (p: any) =>
                `ID:${p.id} | Nome:${p.name} | Cat:${p.categoryName} | Marca:${p.brand || '-'} | Unid:${p.unit} (${p.weightValue}) | Preço:R$${Number(p.price).toFixed(2)}${
                  p.salePrice ? ` | PROMO:R$${Number(p.salePrice).toFixed(2)}` : ''
                } | EmPromo:${p.isPromo ? 'SIM' : 'NÃO'}`
            )
            .join('\n')
        : '';

      const historyText = Array.isArray(history)
        ? history
            .slice(-6)
            .map((h: any) => `${h.role === 'user' ? 'Cliente' : 'Assistente'}: ${h.content}`)
            .join('\n')
        : '';

      const measurementsText = measurements
        ? `Medidas/Dados informados pelo cliente: Ambiente=${measurements.roomType || 'não especificado'}, Largura=${measurements.width || '-'}m, Comprimento=${measurements.length || '-'}m, Altura=${measurements.height || '-'}m, Cor informada=${measurements.colorName || '-'}.`
        : '';

      const imageDescriptions = Array.isArray(images) && images.length > 0
        ? images.map((img: any, idx: number) => `Imagem ${idx + 1}: ${img.label || 'Anexo do cliente'}`).join(' | ')
        : 'Nenhuma imagem anexada.';

      const systemInstruction = `Você é o Assistente Técnico Oficial da LM Store (loja de materiais de construção). Responda SEMPRE em Português do Brasil (pt-BR) de forma objetiva, técnica e amigável.

Suas capacidades obrigatórias:
1. Análise de fotos de materiais de construção / listas manuscritas / obra: gere uma lista detalhada de materiais com quantidades comerciais e vincule cada item ao \`matchedProductId\` exato do catálogo da LM Store abaixo (priorizando opções em promoção \`isPromoOption: true\` quando disponíveis).
2. Cálculo de Sala ou Garagem (com ou sem foto anexada): calcule área em m², margem de corte (+10%), quantidade de piso/porcelanato (m²/caixas), sacos de cimento (contrapiso/regularização, 50kg), sacos de argamassa colante AC-II/AC-III (20kg) e rejunte (kg), preenchendo \`roomEstimate\` e \`materialsList\` com links dos produtos do catálogo.
   - Se o cliente anexou uma foto de sala/garagem E uma foto de piso/revestimento (ou pediu simulação visual com o piso anexado), defina \`shouldGenerateImage: true\`, \`imageGenerationMode: "room_floor"\` e escreva \`imageGenerationPrompt\` descrevendo detalhadamente a aplicação da textura/piso da imagem de piso no chão da foto da sala/garagem mantendo paredes, móveis e iluminação.
3. Cálculo e Simulação de Pintura de Parede: se o cliente enviou foto de parede e/ou informou medidas e cor (por nome ou por foto de referência de cor):
   - Calcule área da parede (m²), quantidade exata de tinta (litros e latas/galões de 3,6L ou 18L), quantas demãos são recomendadas (ex: "2 a 3 demãos"), tempo de secagem (ao toque, entre demãos e final), e custo estimado em R$ com base nos produtos do catálogo, preenchendo \`paintEstimate\` e \`materialsList\`.
   - Se houver foto da parede anexada e cor informada (por nome ou por segunda imagem de referência), defina \`shouldGenerateImage: true\`, \`imageGenerationMode: "wall_paint"\` e escreva \`imageGenerationPrompt\` descrevendo a pintura realista da parede na cor desejada preservando iluminação, sombras, tomadas e objetos.
4. Dúvidas de pedidos e entregas: use o contexto de pedido/carrinho do cliente (${JSON.stringify(orderContext)}).

Catálogo real de produtos LM Store (use estes IDs exatos em matchedProductId):
${catalogText}`;

      const parts: any[] = [];
      if (Array.isArray(images)) {
        for (const img of images.slice(0, 3)) {
          if (img?.dataUrl) {
            const parsed = parseDataUrl(img.dataUrl);
            parts.push({
              inlineData: {
                data: parsed.data,
                mimeType: parsed.mimeType,
              },
            });
          }
        }
      }

      const fullPrompt = [
        historyText ? `Histórico recente:\n${historyText}` : '',
        `Imagens anexadas (${images.length}): ${imageDescriptions}`,
        measurementsText,
        `Mensagem do cliente: ${message || 'Analise os anexos enviados e gere a lista completa/cálculo e simulação.'}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      parts.push({ text: fullPrompt });

      const textResponse = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: { parts },
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: thinkingMode ? ThinkingLevel.HIGH : ThinkingLevel.LOW,
          },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Resposta completa e clara em português para o cliente.',
              },
              thinkingSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Etapas resumidas do raciocínio técnico e dimensionamento de engenharia.',
              },
              materialsList: {
                type: Type.ARRAY,
                description: 'Lista de materiais recomendados com IDs do catálogo da LM Store.',
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    quantity: { type: Type.STRING },
                    notes: { type: Type.STRING },
                    matchedProductId: { type: Type.STRING },
                    isPromoOption: { type: Type.BOOLEAN },
                  },
                },
              },
              paintEstimate: {
                type: Type.OBJECT,
                description: 'Preencher quando envolver cálculo de pintura de parede.',
                properties: {
                  surfaceAreaM2: { type: Type.NUMBER },
                  litersNeeded: { type: Type.STRING },
                  cansRecommended: { type: Type.STRING },
                  coats: { type: Type.STRING },
                  dryingTime: { type: Type.STRING },
                  estimatedCostBRL: { type: Type.NUMBER },
                },
              },
              roomEstimate: {
                type: Type.OBJECT,
                description: 'Preencher quando envolver cálculo de sala, garagem, piso, cimento ou argamassa.',
                properties: {
                  floorAreaM2: { type: Type.NUMBER },
                  floorWithMarginM2: { type: Type.STRING },
                  cementBags: { type: Type.STRING },
                  mortarBags: { type: Type.STRING },
                  groutKg: { type: Type.STRING },
                  estimatedCostBRL: { type: Type.NUMBER },
                },
              },
              shouldGenerateImage: {
                type: Type.BOOLEAN,
                description: 'True somente se o usuário enviou foto do ambiente/parede e solicitou ou anexou piso/cor para visualizar como ficaria.',
              },
              imageGenerationMode: {
                type: Type.STRING,
                description: 'wall_paint, room_floor, ou none',
              },
              imageGenerationPrompt: {
                type: Type.STRING,
                description: 'Instrução detalhada para gerar a imagem simulada mantendo perspectiva e iluminação.',
              },
            },
          },
        },
      });

      const parsedJson = JSON.parse((textResponse.text || '{}').trim());

      let generatedImage: string | undefined = undefined;
      let generatedImageWarning: string | undefined = undefined;
      let modelUsed = thinkingMode
        ? 'gemini-4-hydrogen (Dimensionamento Profundo)'
        : 'gemini-4-hydrogen';

      if (
        parsedJson.shouldGenerateImage &&
        Array.isArray(images) &&
        images.length > 0 &&
        parsedJson.imageGenerationPrompt
      ) {
        try {
          const imageParts = images.slice(0, 2).map((img: any) => {
            const p = parseDataUrl(img.dataUrl);
            return { inlineData: { data: p.data, mimeType: p.mimeType } };
          });
          const imgRes = await generateEditedImageWithFallback(
            ai,
            imageParts,
            parsedJson.imageGenerationPrompt,
            '4:3'
          );
          generatedImage = imgRes.imageUrl;
          modelUsed = `${modelUsed} + ${imgRes.modelUsed}`;
        } catch (imgErr: any) {
          console.warn('[Assistant Image Gen] Falha ao gerar imagem visual:', imgErr?.message || imgErr);
          const formatted = formatGeminiErrorMessage(imgErr);
          generatedImageWarning = formatted.message;
        }
      }

      return res.json({
        success: true,
        reply: parsedJson.reply || 'Análise concluída.',
        thinkingProcess: Array.isArray(parsedJson.thinkingSteps) ? parsedJson.thinkingSteps : [],
        materialsList: Array.isArray(parsedJson.materialsList) ? parsedJson.materialsList : undefined,
        paintEstimate: parsedJson.paintEstimate?.surfaceAreaM2 ? parsedJson.paintEstimate : undefined,
        roomEstimate: parsedJson.roomEstimate?.floorAreaM2 ? parsedJson.roomEstimate : undefined,
        generatedImage,
        generatedImageWarning,
        modelUsed,
      });
    } catch (error: any) {
      console.error('Erro na rota /api/ai/assistant-chat:', error);
      const formatted = formatGeminiErrorMessage(error);
      return res.status(formatted.status).json({ error: formatted.message });
    }
  });

  // Mount Vite middleware in development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        const rawHtml = fs.readFileSync(indexPath, 'utf-8');
        const template = await vite.transformIndexHtml(url, rawHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Servidor LM Store rodando na porta ${PORT}`);
  });
}

startServer();

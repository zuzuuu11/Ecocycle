'use strict';

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
  readDb,
  writeDb,
  findUserByEmail,
  findUserById,
  saveUser,
  publicUser,
  findProductByBarcode,
} = require('./db');

const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me';
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  const token = h.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: 'Não autorizado' });
    req.authUser = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '30d' });
}

function ensureDemoUser() {
  const demoEmail = 'oliviahelena540@gmail.com';
  if (findUserByEmail(demoEmail)) return;
  const hash = bcrypt.hashSync('sixseven', BCRYPT_ROUNDS);
  const user = {
    id: crypto.randomUUID(),
    email: demoEmail,
    passwordHash: hash,
    displayName: 'Olivia Helena',
    impactKgCo2: 2753,
    points: 3200,
    pointsGoal: 8900,
    createdAt: new Date().toISOString(),
  };
  saveUser(user);
}

function chatReply(message) {
  const m = message.toLowerCase();
  if (/pilha|bateria|eletr[oô]nico|celular/.test(m)) {
    return 'Resíduos eletrônicos e pilhas devem ir a pontos de coleta especializados. Quer que eu liste parceiros na tela Locais de descarte?';
  }
  if (/pl[aá]stico|garrafa|pet/.test(m)) {
    return 'Plásticos limpos e secos podem ir à coleta seletiva. Garrafas PET são amplamente recicláveis no Brasil.';
  }
  if (/papel/.test(m)) {
    return 'Papel seco vai para reciclagem; papel sujo ou engordurado deve ir ao lixo orgânico ou rejeito, conforme a cidade.';
  }
  if (/vidro|metal|alum[ií]nio/.test(m)) {
    return 'Vidro e alumínio são muito recicláveis. Separe por tipo e leve ao ecoponto mais próximo.';
  }
  if (/[óo]leo|cozinha/.test(m)) {
    return 'Óleo de cozinha usado não deve ir ao ralo. Procure pontos de descarte de óleo — use a lista de parceiros no app.';
  }
  if (/mapa|local|pr[oó]ximo|onde/.test(m)) {
    return 'Abra Locais de descarte no início do app para ver parceiros e distâncias.';
  }
  if (/impacto|co2|carbono/.test(m)) {
    return 'Cada produto escaneado mostra estimativas de impacto. Escaneie o código de barras na aba Escanear.';
  }
  return 'Obrigado pela pergunta. Posso falar sobre descarte de plástico, papel, metal, eletrônicos ou óleo. O que você quer descartar?';
}

async function bootstrap() {
  ensureDemoUser();
}

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '512kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ecocycle-api' });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || '');
    const displayName = String(req.body?.displayName || '').trim();
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }
    const hash = bcrypt.hashSync(password, BCRYPT_ROUNDS);
    const user = {
      id: crypto.randomUUID(),
      email,
      passwordHash: hash,
      displayName: displayName || email.split('@')[0],
      impactKgCo2: 0,
      points: 0,
      pointsGoal: 8900,
      createdAt: new Date().toISOString(),
    };
    saveUser(user);
    const token = signToken(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao registrar.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String(req.body?.email || '')
      .trim()
      .toLowerCase();
    const password = String(req.body?.password || '');
    const user = findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    }
    const token = signToken(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao entrar.' });
  }
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: publicUser(req.authUser) });
});

app.patch('/api/me', authMiddleware, (req, res) => {
  try {
    const displayName = req.body?.displayName;
    if (displayName === undefined) {
      return res.status(400).json({ error: 'Nada para atualizar.' });
    }
    const next = String(displayName).trim();
    if (!next) {
      return res.status(400).json({ error: 'Nome inválido.' });
    }
    req.authUser.displayName = next;
    saveUser(req.authUser);
    res.json({ user: publicUser(req.authUser) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao salvar.' });
  }
});

app.post('/api/me/scan', authMiddleware, (req, res) => {
  const barcode = String(req.body?.barcode || '').trim();
  const product = findProductByBarcode(barcode);
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado.' });
  }

  const user = req.authUser;
  const now = Date.now();
  const windowMs = 90_000;
  user.scanHistory = Array.isArray(user.scanHistory) ? user.scanHistory : [];
  const recent = user.scanHistory.filter((e) => now - e.at < windowMs);
  const duplicate = recent.some((e) => e.barcode === barcode);
  user.scanHistory = [...recent, { barcode, at: now }].slice(-40);

  if (duplicate) {
    saveUser(user);
    return res.json({
      pointsAdded: 0,
      impactAddedKg: 0,
      user: publicUser(user),
    });
  }

  const co2 = product.environmentalImpact?.co2 ?? 0;
  const pointsAdd = Math.min(500, 25 + Math.round(co2 / 50));
  const impactAdd = Math.round((co2 / 1000) * 10) / 10;
  user.points = (user.points || 0) + pointsAdd;
  user.impactKgCo2 = Math.round(((user.impactKgCo2 || 0) + impactAdd) * 10) / 10;
  saveUser(user);
  res.json({
    pointsAdded: pointsAdd,
    impactAddedKg: impactAdd,
    user: publicUser(user),
  });
});

app.get('/api/products/:barcode', (req, res) => {
  const barcode = decodeURIComponent(req.params.barcode || '');
  const product = findProductByBarcode(barcode);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json({ product });
});

app.get('/api/catalog/disposal-partners', (_req, res) => {
  const db = readDb();
  res.json({ partners: db.disposalPartners });
});

app.get('/api/catalog/recyclers', (_req, res) => {
  const db = readDb();
  res.json({ recyclers: db.recyclers });
});

app.get('/api/catalog/rewards', authMiddleware, (_req, res) => {
  const db = readDb();
  const u = req.authUser;
  const tiers = db.rewardTiers.map((t) => ({
    ...t,
    current: u.points,
    progress: Math.min(1, u.points / t.goal),
  }));
  res.json({
    points: u.points,
    pointsGoal: u.pointsGoal,
    tiers,
  });
});

app.post('/api/chat', (req, res) => {
  const message = String(req.body?.message || '').trim();
  if (!message) {
    return res.status(400).json({ error: 'Mensagem vazia' });
  }
  res.json({ reply: chatReply(message) });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Não encontrado' });
});

bootstrap().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Ecocycle API em http://0.0.0.0:${PORT}/api`);
  });
});

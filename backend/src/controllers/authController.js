const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Semua kolom harus diisi.' });

  try {
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) return res.status(409).json({ message: 'Email sudah terdaftar.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'Registrasi berhasil!', userId: newUser.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email dan password harus diisi.' });

  try {
    const user = await userModel.findByEmail(email);
    if (!user) return res.status(401).json({ message: 'Email atau password salah.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Email atau password salah.' });

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login berhasil!', token });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server.', error: error.message });
  }
};
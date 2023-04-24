import User from '../models/User'
import Role from '../models/Role'
import Person from '../models/Person'

import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { WORD_SECRET } from '../config/config'
import { validationResult } from 'express-validator'
import * as config from '../config/config'
import path from 'path'
import fs from 'fs-extra'
import handlebars from 'handlebars'
import { transporter } from '../config/mailer'

export const signin = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() })
  }

  const { email, password } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { email }, include: Role })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if (!passCorrecto) {
      return res.status(400).json({ msg: 'Password incorrecto' })
    }
    console.log(usuario.rol.nombre_rol)

    // Token
    jwt.sign({ id: usuario.id_persona }, WORD_SECRET, {
      expiresIn: 21600 //6 horas
    }, (error, token) => {
      if (error) throw error
      // Mensaje de confirmacion
      res.json({ token })
    })
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'Hubo un error durante el login' })
  }
}

export const profile = async (req, res) => {
  try {
    const persona = await Person.findAll({ where: { id_persona: req.userId } })
    const usuario = await User.findAll({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] }, include: Role })

    const user = { ...{ persona }, usuario }
    res.json({ user })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Hubo un error al encontrar su perfil' })
  }
}

export const updateData = async (req, res) => {
  const { telefono, email, adicional } = req.body
  try {
    const persona = await Person.findByPk(req.userId)
    const usuario = await User.findOne({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] } })

    if (!persona || !usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado' })
    }
    if (telefono) {
      persona.telefono = telefono
    }
    if (email) {
      usuario.email = email
    }
    if (adicional) {
      usuario.adicional = adicional
    }
    if (email || adicional) {
      await usuario.save()
    }
    if (telefono) {
      await persona.save()
    }
    const user = { ...{ persona }, usuario }
    res.status(200).json({ user })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { id_persona: req.userId } })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if (!passCorrecto) {
      return res.status(500).json({ msg: 'La contraseña actual es incorrecta' })
    }

    const salt = await bcryptjs.genSalt(10)
    const newPass = await bcryptjs.hash(newPassword, salt)
    usuario.password = newPass
    await usuario.save()
    res.status(200).json({ categoria: 'success', msg: 'Contraseña actualizada exitosamente' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}


export const updateImageProfile = async (req, res) => {

  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { id_persona: req.userId } })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe' })
    }

    if (usuario.avatar) {
      await fs.unlink(path.resolve(usuario.avatar))
    }
    console.log(req.file)
    usuario.avatar = req.file.path
    await usuario.save()
    res.status(200).json({ categoria: 'success', msg: 'Imagen actualizada exitosamente' })
  } catch (error) {

    console.log('-------> ', error);
    res.status(500).json({ msg: 'Error en el servidor' })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'email es requerido' });
  }
  const mensaje = 'Recibirás un email con instrucciones para reiniciar tu contraseña en unos minutos.'
  let linkVerificacion;
  let emailStatus = 'OK';
  let usuario;
  try {
    usuario = await User.findOne({ where: { email } })
    const token = jwt.sign({ id: usuario.id_persona }, config.WORD_SECRET_RESET, { expiresIn: 600 })
    linkVerificacion = `http://${config.DB_HOST}:${config.PORT_FRONT}/auth/new-password/${token}`;
    usuario.reset_token = token;
  } catch (error) {
    return res.json({ msg: 'No se encontró el email del usuario', categoria: 'danger' });
  }

  const filePath = path.join(__dirname, '../templates/email.hbs');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source)({link:linkVerificacion});

  try {
    await transporter.sendMail({
      from: '"Olvide la contraseña  👻" <brielalica@gmail.com>', // sender address
      to: usuario.email, // list of receivers
      subject: "Olvide la contraseña", // Subject line
      html: template,
    });
  } catch (error) {
    emailStatus = error;
    return res.status(400).json({ msg: 'algo salio mal', categoria: 'danger' })
  }
  try {
    await usuario.save()
  } catch (error) {
    emailStatus = error;
    return res.status(400).json({ msg: 'Algo salio mal', categoria: 'danger' });
  }
  res.json({ msg: mensaje, info: emailStatus })
}

export const createNewPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.headers.reset
  if (!(resetToken && newPassword)) {
    res.status(400).json({ msg: 'todos los campos son requeridos', categoria: 'danger' });
  }
  let jwtPayload;
  let usuario;
  try {
    jwtPayload = jwt.verify(resetToken, config.WORD_SECRET_RESET);
    usuario = await User.findOne({ where: { reset_token: resetToken } })

  } catch (error) {
    return res.status(401).json({ msg: 'Algo salio mal', categoria: 'danger' })
  }
  try {
    const salt = await bcryptjs.genSalt(10)
    const newPass = await bcryptjs.hash(newPassword, salt)
    usuario.password = newPass
    await usuario.save()
  } catch (error) {
    return res.status(401).json({ msg: 'Algo salio mal', categoria: 'danger' })
  }

  res.json({ msg: 'La contraseña fue cambiada' })
}
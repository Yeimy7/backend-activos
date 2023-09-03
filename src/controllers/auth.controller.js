import * as config from '../config/config.js'
import bcryptjs from 'bcryptjs'
import fs from 'fs-extra'
import handlebars from 'handlebars'
import jwt from 'jsonwebtoken'
import path from 'path'
import { WORD_SECRET } from '../config/config'
import { transporter } from '../config/mailer'
import Person from '../models/Person.js'
import Role from '../models/Role.js'
import User from '../models/User.js'


export const signin = async (req, res) => {
  const { email, password } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { email }, include: Role })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe', type: 'error' })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if (!passCorrecto) {
      return res.status(400).json({ msg: 'Password incorrecto', type: 'error' })
    }

    // Token
    jwt.sign({ id: usuario.id_persona }, WORD_SECRET, {
      expiresIn: 21600 //6 horas
    }, (error, token) => {
      if (error) throw error
      // Mensaje de confirmacion
      res.json({ token })
    })
  } catch (error) {
    res.status(400).json({ msg: 'Hubo un error durante el login, intentelo nuevamente', type: 'error' })
  }
}

export const profile = async (req, res) => {
  try {
    const persona = await Person.findAll({ where: { id_persona: req.userId } })
    const usuario = await User.findAll({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] }, include: Role })

    const user = { ...{ persona }, usuario }
    res.json({ user })
  } catch (error) {
    res.status(500).json({ msg: 'Hubo un error al buscar su perfil', type: 'error' })
  }
}

export const updateData = async (req, res) => {
  const { telefono, email, adicional } = req.body
  try {
    const persona = await Person.findByPk(req.userId)
    const usuario = await User.findOne({ where: { id_persona: req.userId }, attributes: { exclude: ['password'] } })

    if (!persona || !usuario) {
      return res.status(404).json({ msg: 'Usuario no encontrado', type: 'error' })
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
    res.status(500).json({ msg: 'Error en el servidor, intente nuevamente', type: 'error' })
  }
}

export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { id_persona: req.userId } })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe', type: 'error' })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if (!passCorrecto) {
      return res.status(500).json({ msg: 'La contraseña actual es incorrecta', type: 'error' })
    }

    const salt = await bcryptjs.genSalt(10)
    const newPass = await bcryptjs.hash(newPassword, salt)
    usuario.password = newPass
    await usuario.save()
    res.status(200).json({ msg: 'Contraseña actualizada exitosamente', type: 'success' })
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevamente', type: 'error' })
  }
}


export const updateImageProfile = async (req, res) => {
  try {
    // Revisar que sea un usuario registrado
    let usuario = await User.findOne({ where: { id_persona: req.userId } })
    if (!usuario) {
      return res.status(400).json({ msg: 'El usuario no existe', type: 'error' })
    }

    if (usuario.avatar) {
      await fs.unlink(path.resolve(usuario.avatar))
    }
    usuario.avatar = req.file.path
    const result = await usuario.save()
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor, intente nuevamente', type: 'error' })
  }
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: 'El email es requerido', type: 'error' });
  }
  const mensaje = 'Recibirás un email con instrucciones para reiniciar tu contraseña en unos minutos. <p><b>Por favor, revise su email</b></p>'
  let linkVerificacion;
  let emailStatus = 'OK';
  let usuario;
  try {
    usuario = await User.findOne({ where: { email } })
    const token = jwt.sign({ id: usuario.id_persona }, config.WORD_SECRET_RESET, { expiresIn: 600 })
    linkVerificacion = `http://${config.DB_HOST}:${config.PORT_FRONT}/auth/new-password/${token}`;
    usuario.reset_token = token;
  } catch (error) {
    return res.json({ msg: 'No se encontró el email del usuario', type: 'error' });
  }

  const filePath = path.join(__dirname, '../templates/email.hbs');
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source)({ link: linkVerificacion });

  try {
    await transporter.sendMail({
      from: '"Olvide la contraseña  👻" <virgeninaepdb@gmail.com>', // sender address
      to: usuario.email, // list of receivers
      subject: "Olvide la contraseña", // Subject line
      html: template,
    });
  } catch (error) {
    emailStatus = error;
    return res.status(400).json({ msg: 'algo salio mal, intente nuevamente', type: 'error' })
  }
  try {
    await usuario.save()
  } catch (error) {
    emailStatus = error;
    return res.status(400).json({ msg: 'Algo salio mal, intente nuevamente', type: 'error' });
  }
  res.json({ msg: mensaje, info: emailStatus, type: 'success' })
}

export const createNewPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.headers.reset
  if (!(resetToken && newPassword)) {
    res.status(400).json({ msg: 'todos los campos son requeridos', type: 'error' });
  }
  let jwtPayload;
  let usuario;
  try {
    jwtPayload = jwt.verify(resetToken, config.WORD_SECRET_RESET);
    usuario = await User.findOne({ where: { reset_token: resetToken } })

  } catch (error) {
    return res.status(401).json({ msg: 'Algo salio mal, intente nuevamente', type: 'error' })
  }
  try {
    const salt = await bcryptjs.genSalt(10)
    const newPass = await bcryptjs.hash(newPassword, salt)
    usuario.password = newPass
    await usuario.save()
  } catch (error) {
    return res.status(401).json({ msg: 'Algo salio mal, intente nuevamente', type: 'error' })
  }

  res.json({ msg: 'La contraseña fue cambiada.', type: 'success' })
}
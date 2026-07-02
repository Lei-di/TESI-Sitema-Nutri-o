import Joi from 'joi';

const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).required().messages({
        'string.empty': 'O campo nome não pode estar vazio.',
        'string.min': 'O nome deve ter no mínimo 3 caracteres.',
        'any.required': 'O campo nome é obrigatório.'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'O campo e-mail não pode estar vazio.',
        'string.email': 'Por favor, insira um e-mail válido.',
        'any.required': 'O campo e-mail é obrigatório.'
    }),
    telefone: Joi.string().min(10).max(11).required().messages({
        'string.empty': 'O campo telefone não pode estar vazio.',
        'string.min': 'O telefone deve ter pelo menos 10 dígitos (com DDD).',
        'string.max': 'O telefone deve ter no máximo 11 dígitos.',
        'any.required': 'O campo telefone é obrigatório.'
    })
});

const validarUsuario = (req, res, next) => {
    const { error } = usuarioSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const mensagens = error.details.map(detail => detail.message);
        return res.status(400).json({ erros: mensagens });
    }

    next(); 
};

export default validarUsuario;
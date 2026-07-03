import Joi from 'joi';

const usuarioSchema = Joi.object({
    nome: Joi.string()
        .min(3)
        .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
        .required()
        .messages({
            'string.empty': 'O campo nome não pode estar vazio.',
            'string.min': 'O nome deve ter no mínimo 3 caracteres.',
            'string.pattern.base': 'O nome deve conter apenas letras e espaços.',
            'any.required': 'O campo nome é obrigatório.'
        }),

    email: Joi.string().email().required().messages({
        'string.empty': 'O campo e-mail não pode estar vazio.',
        'string.email': 'Por favor, insira um e-mail válido.',
        'any.required': 'O campo e-mail é obrigatório.'
    }),

    telefone: Joi.string()
        .pattern(/^\d{10,11}$/)
        .required()
        .messages({
            'string.empty': 'O campo telefone não pode estar vazio.',
            'string.pattern.base': 'O telefone deve conter só números, com DDD.',
            'any.required': 'O campo telefone é obrigatório.'
        }),

    senha: Joi.string()
        .min(6)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
        .required()
        .messages({
            'string.empty': 'O campo senha não pode estar vazio.',
            'string.min': 'A senha deve ter no mínimo 6 caracteres.',
            'string.pattern.base': 'A senha deve ter ao menos 1 letra maiúscula, 1 minúscula e 1 número.',
            'any.required': 'O campo senha é obrigatório.'
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
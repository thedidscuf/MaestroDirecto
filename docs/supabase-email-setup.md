# 📧 Configuración de Emails en Supabase - MaestroDirecto

## 🚨 PROBLEMA IDENTIFICADO

El sistema de restablecimiento de contraseñas no envía emails porque **falta configurar el proveedor de emails en Supabase**.

## ✅ SOLUCIÓN: Configurar Emails en Supabase Dashboard

### 1. **Acceder a Supabase Dashboard**
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto MaestroDirecto
3. Ve a **Authentication** → **Settings**

### 2. **Configurar SMTP (Recomendado para Producción)**

#### Opción A: Gmail SMTP
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: tu-email@gmail.com
SMTP Pass: tu-app-password (no tu contraseña normal)
```

#### Opción B: SendGrid (Recomendado)
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: tu-sendgrid-api-key
```

#### Opción C: Mailgun
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP User: postmaster@tu-dominio.mailgun.org
SMTP Pass: tu-mailgun-password
```

### 3. **Configurar URLs de Redirección**

En **Authentication** → **URL Configuration**:

```
Site URL: https://tu-dominio.com
Redirect URLs:
- https://tu-dominio.com/update-password
- http://localhost:5173/update-password (para desarrollo)
```

### 4. **Personalizar Plantillas de Email**

En **Authentication** → **Email Templates** → **Reset Password**:

```html
<h2>Restablecer Contraseña - MaestroDirecto</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en MaestroDirecto.</p>
<p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
<p><a href="{{ .ConfirmationURL }}">Restablecer Contraseña</a></p>
<p>Este enlace expira en 1 hora.</p>
<p>Si no solicitaste este cambio, puedes ignorar este email.</p>
<p>Saludos,<br>Equipo MaestroDirecto</p>
```

## 🔧 CONFIGURACIÓN PASO A PASO

### Para Gmail:

1. **Habilitar 2FA en Gmail**
2. **Generar App Password:**
   - Ve a Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Genera una contraseña para "Mail"
3. **Usar esa App Password en Supabase**

### Para SendGrid:

1. **Crear cuenta en SendGrid**
2. **Verificar dominio**
3. **Generar API Key**
4. **Configurar en Supabase**

## 🧪 TESTING

### 1. **Probar en Desarrollo:**
```bash
# En tu aplicación local
1. Ve a /reset-password
2. Ingresa un email válido
3. Revisa los logs de Supabase
4. Verifica que llegue el email
```

### 2. **Verificar Logs:**
En Supabase Dashboard → **Logs** → **Auth Logs**

## 🚀 CONFIGURACIÓN RÁPIDA PARA TESTING

### Usar Gmail Temporalmente:

1. **Crear email de prueba:**
   - Crea una cuenta Gmail específica para la app
   - Ejemplo: `maestrodirecto.test@gmail.com`

2. **Configurar en Supabase:**
   ```
   SMTP Host: smtp.gmail.com
   SMTP Port: 587
   SMTP User: maestrodirecto.test@gmail.com
   SMTP Pass: [app-password-generado]
   ```

3. **Probar inmediatamente:**
   - El sistema debería enviar emails en 1-2 minutos

## 📋 CHECKLIST DE CONFIGURACIÓN

- [ ] ✅ **SMTP configurado** en Supabase Dashboard
- [ ] ✅ **Site URL** configurada correctamente
- [ ] ✅ **Redirect URLs** incluyen `/update-password`
- [ ] ✅ **Email template** personalizada
- [ ] ✅ **Dominio verificado** (si usas dominio propio)
- [ ] ✅ **Testing realizado** con email real

## 🔍 DEBUGGING

### Si no llegan los emails:

1. **Verificar logs en Supabase:**
   - Dashboard → Logs → Auth Logs
   - Buscar errores de SMTP

2. **Verificar configuración SMTP:**
   - Host, puerto, usuario, contraseña correctos
   - Autenticación habilitada

3. **Verificar carpeta de spam:**
   - Los emails pueden llegar a spam inicialmente

4. **Probar con diferentes emails:**
   - Gmail, Outlook, Yahoo, etc.

## 🎯 RESULTADO ESPERADO

Una vez configurado correctamente:

1. **Usuario va a `/reset-password`**
2. **Ingresa su email**
3. **Recibe email en 1-2 minutos**
4. **Hace clic en el enlace**
5. **Puede cambiar su contraseña**
6. **Sistema funciona 100%**

## 📞 SOPORTE

Si tienes problemas:
- **Supabase Docs:** [https://supabase.com/docs/guides/auth](https://supabase.com/docs/guides/auth)
- **Community:** [https://github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

## ⚡ ACCIÓN INMEDIATA REQUERIDA

**Para que funcione el restablecimiento de contraseñas, DEBES configurar SMTP en Supabase Dashboard AHORA.**

Sin esta configuración, los emails no se enviarán y los usuarios no podrán restablecer sus contraseñas.
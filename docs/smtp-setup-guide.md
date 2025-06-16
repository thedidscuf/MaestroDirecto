# 🚨 CONFIGURACIÓN URGENTE: SMTP en Supabase

## ❌ PROBLEMA IDENTIFICADO

El sistema de restablecimiento de contraseñas **NO FUNCIONA** porque falta configurar SMTP en Supabase Dashboard.

**Síntomas:**
- Se queda cargando infinitamente
- Los emails no se envían
- Error en consola: "SMTP not configured"

## ✅ SOLUCIÓN INMEDIATA (5 MINUTOS)

### 1. **Acceder a Supabase Dashboard**
```
1. Ve a: https://supabase.com/dashboard
2. Selecciona tu proyecto MaestroDirecto
3. Ve a: Authentication → Settings
4. Busca la sección "SMTP Settings"
```

### 2. **Configuración Rápida con Gmail**

#### Paso 1: Preparar Gmail
```
1. Ve a tu cuenta Gmail
2. Configuración → Ver toda la configuración
3. Seguridad → Verificación en 2 pasos (activar)
4. Contraseñas de aplicaciones → Generar nueva
5. Selecciona "Correo" → Generar
6. Copia la contraseña de 16 caracteres
```

#### Paso 2: Configurar en Supabase
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP User: tu-email@gmail.com
SMTP Pass: [contraseña-de-16-caracteres-generada]
SMTP Admin Email: tu-email@gmail.com
Enable SMTP: ✓ ACTIVADO
```

### 3. **Configurar URLs de Redirección**

En la misma página, sección "URL Configuration":
```
Site URL: http://localhost:5173
Additional Redirect URLs:
- http://localhost:5173/update-password
- https://tu-dominio.com/update-password (si tienes dominio)
```

### 4. **Guardar y Esperar**
```
1. Hacer clic en "Save"
2. Esperar 2-3 minutos para que se apliquen los cambios
3. Probar el sistema inmediatamente
```

## 🧪 TESTING INMEDIATO

### Probar el Sistema:
```
1. Ve a tu aplicación: http://localhost:5173/reset-password
2. Ingresa un email válido (tuyo)
3. Haz clic en "Enviar enlace"
4. Revisa tu bandeja de entrada (y spam)
5. Deberías recibir el email en 1-2 minutos
```

### Verificar en Consola:
```
Abre F12 → Console
Deberías ver:
✅ Email configuration OK
✅ Password reset email sent successfully
```

## 🔧 CONFIGURACIONES ALTERNATIVAS

### Opción 2: SendGrid (Recomendado para Producción)
```
1. Crear cuenta en SendGrid
2. Verificar dominio
3. Generar API Key
4. Configurar en Supabase:
   Host: smtp.sendgrid.net
   Port: 587
   User: apikey
   Pass: [tu-sendgrid-api-key]
```

### Opción 3: Mailgun
```
Host: smtp.mailgun.org
Port: 587
User: postmaster@tu-dominio.mailgun.org
Pass: [tu-mailgun-password]
```

## 🚨 ERRORES COMUNES

### Error: "Authentication failed"
**Solución:**
- Verifica que usas la contraseña de aplicación (no tu contraseña normal)
- Asegúrate de que 2FA esté activado en Gmail

### Error: "SMTP connection failed"
**Solución:**
- Verifica Host: smtp.gmail.com
- Verifica Port: 587
- Verifica que Enable SMTP esté activado

### Error: "Rate limit exceeded"
**Solución:**
- Espera 15 minutos
- No envíes múltiples emails seguidos

## 📧 PLANTILLA DE EMAIL PERSONALIZADA

En Supabase Dashboard → Authentication → Email Templates → Reset Password:

```html
<h2>Restablecer Contraseña - MaestroDirecto</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
<p><a href="{{ .ConfirmationURL }}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Restablecer Contraseña</a></p>
<p>Este enlace expira en 1 hora.</p>
<p>Si no solicitaste este cambio, ignora este email.</p>
<p>Saludos,<br>Equipo MaestroDirecto</p>
```

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] ✅ **SMTP configurado** en Supabase Dashboard
- [ ] ✅ **Gmail 2FA activado** y contraseña de app generada
- [ ] ✅ **URLs de redirección** configuradas
- [ ] ✅ **Enable SMTP** activado
- [ ] ✅ **Cambios guardados** y esperado 2-3 minutos
- [ ] ✅ **Testing realizado** con email real
- [ ] ✅ **Email recibido** en bandeja de entrada

## 🎯 RESULTADO ESPERADO

Una vez configurado correctamente:

```
1. Usuario va a /reset-password ✅
2. Ingresa su email ✅
3. Sistema envía email en 1-2 minutos ✅
4. Usuario recibe email ✅
5. Hace clic en enlace ✅
6. Puede cambiar contraseña ✅
7. Sistema funciona 100% ✅
```

## 📞 SOPORTE URGENTE

Si sigues teniendo problemas después de seguir esta guía:

1. **Verifica logs en Supabase:** Dashboard → Logs → Auth Logs
2. **Copia el error exacto** de la consola del navegador
3. **Contacta:** soporte@maestrodirecto.cl

---

## ⚡ ACCIÓN REQUERIDA AHORA

**SIN CONFIGURAR SMTP, EL SISTEMA NO FUNCIONARÁ.**

Ve INMEDIATAMENTE a Supabase Dashboard y configura SMTP siguiendo esta guía.

**Tiempo estimado: 5 minutos**
**Resultado: Sistema 100% funcional**
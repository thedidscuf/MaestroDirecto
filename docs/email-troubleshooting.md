# 🔧 Solución de Problemas - Emails en MaestroDirecto

## 🚨 PROBLEMA: Los emails no se envían

### ✅ DIAGNÓSTICO PASO A PASO

#### 1. **Verificar Configuración SMTP en Supabase**

**Ve a Supabase Dashboard:**
1. Proyecto → Authentication → Settings
2. Busca la sección "SMTP Settings"
3. Verifica que esté configurado:

```
✅ SMTP Host: smtp.gmail.com (o tu proveedor)
✅ SMTP Port: 587
✅ SMTP User: tu-email@gmail.com
✅ SMTP Pass: [app-password]
✅ Enable SMTP: ✓ Activado
```

#### 2. **Verificar URLs de Redirección**

En Authentication → URL Configuration:
```
✅ Site URL: https://tu-dominio.com
✅ Redirect URLs:
   - https://tu-dominio.com/update-password
   - http://localhost:5173/update-password
```

#### 3. **Verificar Logs de Supabase**

1. Ve a Supabase Dashboard → Logs
2. Busca en "Auth Logs"
3. Filtra por "password reset"
4. Revisa errores SMTP

### 🔍 ERRORES COMUNES Y SOLUCIONES

#### Error: "SMTP not configured"
**Solución:**
```bash
1. Ve a Supabase Dashboard
2. Authentication → Settings
3. Configura SMTP completamente
4. Guarda cambios
5. Espera 2-3 minutos para que se aplique
```

#### Error: "Authentication failed"
**Solución para Gmail:**
```bash
1. Habilita 2FA en Gmail
2. Ve a Google Account → Security
3. Genera "App Password" específica
4. Usa esa contraseña en Supabase (no tu contraseña normal)
```

#### Error: "Rate limit exceeded"
**Solución:**
```bash
1. Espera 15 minutos
2. Intenta nuevamente
3. No envíes múltiples emails seguidos
```

### 🧪 TESTING INMEDIATO

#### Opción 1: Gmail Rápido (5 minutos)
```bash
1. Crea email: maestrodirecto.test@gmail.com
2. Habilita 2FA
3. Genera App Password
4. Configura en Supabase:
   - Host: smtp.gmail.com
   - Port: 587
   - User: maestrodirecto.test@gmail.com
   - Pass: [app-password-de-16-caracteres]
5. Prueba inmediatamente
```

#### Opción 2: SendGrid (Recomendado para producción)
```bash
1. Crea cuenta en SendGrid
2. Verifica dominio
3. Genera API Key
4. Configura en Supabase:
   - Host: smtp.sendgrid.net
   - Port: 587
   - User: apikey
   - Pass: [tu-sendgrid-api-key]
```

### 🔧 COMANDOS DE DEBUGGING

#### En la consola del navegador:
```javascript
// Verificar configuración
import { checkEmailConfiguration } from './lib/supabase';
const config = await checkEmailConfiguration();
console.log('Email config:', config);

// Probar envío
import { sendPasswordResetEmail } from './lib/supabase';
const result = await sendPasswordResetEmail('test@example.com');
console.log('Send result:', result);
```

### 📋 CHECKLIST DE VERIFICACIÓN

- [ ] ✅ **SMTP configurado** en Supabase Dashboard
- [ ] ✅ **Credenciales correctas** (especialmente App Password para Gmail)
- [ ] ✅ **URLs de redirección** configuradas
- [ ] ✅ **Dominio verificado** (si usas dominio propio)
- [ ] ✅ **Logs revisados** en Supabase
- [ ] ✅ **Testing realizado** con email real
- [ ] ✅ **Carpeta de spam** verificada

### 🚀 SOLUCIÓN RÁPIDA (10 MINUTOS)

Si necesitas que funcione AHORA:

```bash
# 1. Configuración Gmail Express
Email: maestrodirecto.app@gmail.com
Password: [genera app password]

# 2. Supabase SMTP
Host: smtp.gmail.com
Port: 587
User: maestrodirecto.app@gmail.com
Pass: [app-password-16-chars]

# 3. URLs
Site URL: http://localhost:5173
Redirect: http://localhost:5173/update-password

# 4. Probar
Ve a /reset-password
Ingresa email real
Revisa bandeja de entrada
```

### 🔍 LOGS DETALLADOS

El sistema ahora incluye logs detallados:

```javascript
// En la consola verás:
📧 Starting password reset process for: user@example.com
✅ User found and active, sending reset email...
🔗 Redirect URL: http://localhost:5173/update-password
✅ Password reset email sent successfully
```

### 📞 SOPORTE TÉCNICO

Si sigues teniendo problemas:

1. **Copia los logs** de la consola del navegador
2. **Copia los logs** de Supabase Dashboard
3. **Envía screenshot** de la configuración SMTP
4. **Contacta:** soporte@maestrodirecto.cl

### ⚡ ACCIÓN INMEDIATA

**El problema MÁS COMÚN es que falta configurar SMTP en Supabase Dashboard.**

1. Ve AHORA a Supabase Dashboard
2. Authentication → Settings
3. Configura SMTP con Gmail
4. Prueba inmediatamente

**Sin SMTP configurado, NO se enviarán emails.**
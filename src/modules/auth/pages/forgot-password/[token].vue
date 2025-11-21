<script setup lang="ts">
useHead({
  titleTemplate: (t) => `Crear nueva contraseña | ${t}`,
});

const { activeIconPass, showPass } = useTheme();
const { resetForm, vReset$, handleReset, loadingReset, verifyToken, isValidToken } = useForgot();

onMounted(async () => {
  await verifyToken();
});
</script>

<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card login-dark">
          <div>
            <AuthLogo />
            <div class="login-main">
              <form v-if="isValidToken" class="theme-form" novalidate @submit.prevent="handleReset">
                <h4>Restablecer contraseña</h4>

                <FormBaseInput
                  id="loginPassword"
                  v-model="resetForm.password"
                  :v-field="vReset$?.password"
                  :type="activeIconPass ? 'password' : 'text'"
                  autocomplete="current-password"
                  label="Nueva Constraseña"
                  placeholder="*********"
                  requiredMark
                >
                  <template #suffix>
                    <button
                      type="button"
                      class="btn btn-link p-0 border-0"
                      :aria-pressed="!activeIconPass"
                      :aria-label="activeIconPass ? 'Mostrar contraseña' : 'Ocultar contraseña'"
                      @click.prevent="showPass"
                      title="Mostrar/Ocultar contraseña"
                    >
                      <Icon class="txt-primary" :name="activeIconPass ? 'fa6-regular:eye' : 'fa6-regular:eye-slash'" />
                    </button>
                  </template>
                </FormBaseInput>

                <FormBaseInput
                  id="resetPassword"
                  v-model="resetForm.confirmPassword"
                  :v-field="vReset$?.confirmPassword"
                  :type="activeIconPass ? 'password' : 'text'"
                  autocomplete="current-password"
                  label="Confirmar Constraseña"
                  placeholder="*********"
                  requiredMark
                >
                </FormBaseInput>

                <div class="form-group mb-0">
                  <div class="text-end">
                    <button type="submit" class="btn btn-primary btn-block w-100 mt-3" :disabled="loadingReset">
                      <span v-if="loadingReset" class="spinner-border spinner-border-sm me-2" />
                      {{ loadingReset ? "Enviando..." : "Restablecer" }}
                    </button>
                  </div>
                </div>

                <p class="mt-4 mb-0 text-center">
                  ¿Ya tienes una contraseña?
                  <NuxtLink :to="{ name: 'auth-login' }">Inicia sesión</NuxtLink>
                </p>
              </form>

              <!-- Mensaje de error -->
              <div v-else class="theme-form">
                <h4>Token no válido</h4>

                <p class="mb-4">
                  Lo sentimos el token no es válido o ya fue expirado, recuerda que tienes 10 minutos para restablecer
                  tu contraseña una vez generado el token.
                </p>

                <p class="mt-4 mb-0 text-center">
                  ¿Deseas generar un nuevo token?
                  <NuxtLink :to="{ name: 'auth-forgot' }">Clic aquí</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ titleTemplate: (t) => `Restablecer contraseña | ${t}` });

const { forgotForm, vForgot$, handleForgot, loadingForgot } = useForgot();
</script>

<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card login-dark">
          <div>
            <AuthLogo />
            <div class="login-main">
              <form class="theme-form" novalidate @submit.prevent="handleForgot">
                <h4>Restablecer contraseña</h4>
                <p>
                  Ingresa tu correo electrónico registrado y recibirás instrucciones para restablecer tu contraseña.
                </p>

                <FormBaseInput
                  id="loginEmail"
                  v-model="forgotForm.email"
                  :v-field="vForgot$?.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  label="Correo electrónico"
                  placeholder="tu@correo.com"
                  requiredMark
                />

                <div class="form-group mb-0">
                  <div class="text-end">
                    <button type="submit" class="btn btn-primary btn-block w-100 mt-3" :disabled="loadingForgot">
                      <span v-if="loadingForgot" class="spinner-border spinner-border-sm me-2" />
                      {{ loadingForgot ? "Enviando..." : "Enviar" }}
                    </button>
                  </div>
                </div>

                <p class="mt-4 mb-0 text-center">
                  ¿Ya tienes una contraseña?
                  <NuxtLink class="ms-2" :to="{ name: 'auth-login' }">Inicia sesión</NuxtLink>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

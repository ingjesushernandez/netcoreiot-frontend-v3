<script setup lang="ts">
useHead({ titleTemplate: (t) => `Iniciar sesión | ${t}` });

const { activeIconPass, showPass } = useTheme();
const { loginForm, vLogin$, handleLogin, loading, remember, loadRemember, persistRemember } = useAuth();

onMounted(async () => {
  loadRemember();
});

watch([remember, () => loginForm.value.email], persistRemember);
</script>

<template>
  <div class="container-fluid p-0">
    <div class="row m-0">
      <div class="col-12 p-0">
        <div class="login-card login-dark">
          <div>
            <AuthLogo />
            <div class="login-main">
              <form class="theme-form" novalidate @submit.prevent="handleLogin">
                <h4>Iniciar sesión</h4>
                <p>Ingresa tu correo electrónico registrado y contraseña para iniciar sesión.</p>

                <FormBaseInput
                  id="loginEmail"
                  v-model="loginForm.email"
                  :v-field="vLogin$?.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  label="Correo electrónico"
                  placeholder="tu@correo.com"
                  requiredMark
                />

                <FormBaseInput
                  id="loginPassword"
                  v-model="loginForm.password"
                  :v-field="vLogin$?.password"
                  :type="activeIconPass ? 'password' : 'text'"
                  autocomplete="current-password"
                  label="Contraseña"
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

                <div class="form-group mb-0">
                  <div class="form-check">
                    <input class="checkbox-primary form-check-input" id="remember" type="checkbox" v-model="remember" />
                    <label class="text-muted form-check-label" for="remember">Recordar datos</label>
                  </div>
                  <NuxtLink title="Recuperar contraseña" class="link" :to="{ name: 'auth-forgot' }">
                    ¿Olvidaste la contraseña?
                  </NuxtLink>
                  <div class="text-end">
                    <button type="submit" class="btn btn-primary btn-block w-100 mt-3" :disabled="loading">
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2" />
                      {{ loading ? "Ingresando…" : "Iniciar sesión" }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

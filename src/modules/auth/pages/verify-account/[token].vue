<script setup lang="ts">
useHead({
  titleTemplate: (t) => `Verificar cuenta | ${t}`,
});

const { verifyAccount, isComfirmAccount, userVerified } = useAuth();

onMounted(async () => {
  await verifyAccount();
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
              <div v-if="isComfirmAccount">
                <h4>Bienvenido,</h4>
                <p class="txt-primary">{{ userVerified.firstName }} {{ userVerified.lastName }}</p>
                <p class="mt-3">
                  Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión y disfrutar de nuestra
                  plataforma IoT.
                </p>
                <p class="text-center mb-0">
                  ¿Ya tienes una cuenta?
                  <NuxtLink :to="{ name: 'auth-login' }">Iniciar sesión</NuxtLink>
                </p>
              </div>

              <div v-else>
                <h4>Lo sentimos</h4>
                <p class="mt-3">
                  Tu cuenta no pudo ser verificada o ya fue verificada. Por favor comunícate con nosotros para darte una
                  solución lo antes posible. Puedes enviarnos un correo electrónico a
                  <a
                    title="Enviar correo a soporte@netcoreiot.com"
                    href="mailto:soporte@netcoreiot.com"
                    rel="noopener noreferrer"
                  >
                    soporte@netcoreiot.com</a
                  >.
                </p>
                <p class="text-center mb-0">
                  ¿Ya tienes una cuenta?
                  <NuxtLink :to="{ name: 'auth-login' }">Iniciar sesión</NuxtLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

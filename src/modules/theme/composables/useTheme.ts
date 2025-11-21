const darkMode = ref<boolean>(false);
const activeIconPass = ref<boolean>(true);
const activeOverlay = ref<boolean>(false);
const showOpenSidebar = ref<boolean>(false);
const showOverlay = ref(false);

export default function () {
  const toggleMode = () => {
    darkMode.value = !darkMode.value;
    if (darkMode.value) {
      localStorage.setItem("mode-template", "dark-only");
    } else {
      localStorage.setItem("mode-template", "light-only");
    }
  };

  const showPass = () => {
    activeIconPass.value = !activeIconPass.value;
  };

  const openSidebar = () => {
    showOpenSidebar.value = !showOpenSidebar.value;
    activeOverlay.value = !activeOverlay.value;
  };

  return {
    darkMode,
    activeIconPass,
    activeOverlay,
    showOpenSidebar,
    showOverlay,

    // Actions
    toggleMode,
    showPass,
    openSidebar,
  };
}

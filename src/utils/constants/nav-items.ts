export type NavPermMode = "any" | "all";

export type NavItem =
  | { type: "link"; title: string; name: string; icon?: string; tooltip?: string; perms?: string[]; mode?: NavPermMode }
  | {
      type: "sub";
      title: string;
      icon?: string;
      tooltip?: string;
      perms?: string[];
      mode?: NavPermMode;
      children: Array<{
        type: "link";
        title: string;
        name: string;
        tooltip?: string;
        perms?: string[];
        mode?: NavPermMode;
      }>;
    };

export const navItems: NavItem[] = [
  {
    type: "link",
    title: "Dashboard",
    name: "home-index",
    icon: "ph:presentation-chart-light",
    tooltip: "Dashboard",
  },
  {
    type: "link",
    title: "Alarmas",
    name: "auth-login",
    icon: "ph:bell-ringing-light",
    tooltip: "Gestión de alarmas",
    perms: ["emqx:alarm_findall"],
  },
  {
    type: "link",
    title: "Reportes",
    name: "auth-login",
    icon: "ph:files-light",
    tooltip: "Generar reportes",
    perms: ["alarm:findall"],
  },
  {
    type: "link",
    title: "Tableros",
    name: "auth-login",
    icon: "ph:chart-line-up-light",
    tooltip: "Ver Mis Tableros",
    perms: ["alarm:findall"],
  },
  {
    type: "link",
    title: "Dispositivos",
    name: "auth-login",
    icon: "ph:circuitry-light",
    tooltip: "Ver dispositivos",
  },
  {
    type: "link",
    title: "Mi dispositivo",
    name: "auth-login",
    icon: "ph:heartbeat-light",
    tooltip: "Salud del dispositivo",
  },
  {
    type: "sub",
    title: "Usuarios",
    icon: "ph:users-light",
    tooltip: "Configuración",
    perms: ["user:findall", "user:create"],
    mode: "any",
    children: [
      { type: "link", title: "Lista", name: "users-index", tooltip: "Listado de usuarios", perms: ["user:findall"] },
      { type: "link", title: "Nuevo", name: "users-new", tooltip: "Nuevo usuario", perms: ["user:create"] },
    ],
  },
  {
    type: "sub",
    title: "Configuración",
    icon: "ph:gear-light",
    tooltip: "Configuración",
    perms: ["role:findall", "user:update", "user:avatar", "user:password"],
    mode: "any",
    children: [
      {
        type: "link",
        title: "Perfil",
        name: "settings-profile",
        tooltip: "Editar perfil",
        perms: ["user:update", "user:avatar"],
        mode: "any",
      },
      { type: "link", title: "Seguridad", name: "settings-security", tooltip: "Seguridad", perms: ["user:password"] },
      {
        type: "link",
        title: "Roles & Permisos",
        name: "settings-roles",
        tooltip: "Gestión de roles",
        perms: ["role:create", "role:findall", "role:update", "role:delete", "role:catalog"],
        mode: "all",
      },
    ],
  },
];

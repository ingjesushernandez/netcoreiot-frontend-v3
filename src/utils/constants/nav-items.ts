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
    title: "Reportes",
    name: "reports-index",
    icon: "ph:files-light",
    tooltip: "Generar reportes",
    perms: ["data:get_report"],
  },
  {
    type: "link",
    title: "Alarmas",
    name: "alarms-index",
    icon: "ph:bell-ringing-light",
    tooltip: "Gestionar alarmas",
    perms: ["emqx:alarm_create", "emqx:alarm_findall"],
    mode: "any",
  },
  {
    type: "sub",
    title: "Dispositivos",
    icon: "ph:circuitry-light",
    tooltip: "Gestionar dispositivos",
    perms: ["device:create", "device:findall", "device:findbyid", "device:update", "device:delete"],
    mode: "any",
    children: [
      {
        type: "link",
        title: "Lista",
        name: "devices-index",
        tooltip: "Listado de dispositivos",
        perms: ["device:findall"],
      },
      { type: "link", title: "Nuevo", name: "devices-new", tooltip: "Nuevo dispositivo", perms: ["device:create"] },
    ],
  },
  {
    type: "sub",
    title: "Tableros",
    icon: "ph:chart-line-up-light",
    tooltip: "Gestionar tableros",
    perms: ["template:create", "template:findall", "template:findbyid", "template:update", "template:delete"],
    mode: "any",
    children: [
      {
        type: "link",
        title: "Lista",
        name: "templates-index",
        tooltip: "Listado de templates",
        perms: ["template:findall"],
      },
      { type: "link", title: "Nuevo", name: "templates-new", tooltip: "Nuevo template", perms: ["template:create"] },
    ],
  },
  {
    type: "sub",
    title: "Usuarios",
    icon: "ph:users-light",
    tooltip: "Gestionar usuarios",
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
    perms: [
      "role:findall",
      "user:update",
      "user:password",
      "file:upload_avatar",
      "file:delete_avatar",
      "role:create",
      "role:findall",
      "role:update",
      "role:delete",
      "role:catalog",
    ],
    mode: "any",
    children: [
      {
        type: "link",
        title: "Perfil",
        name: "settings-profile",
        tooltip: "Editar perfil",
        perms: ["user:update", "file:upload_avatar", "file:delete_avatar"],
        mode: "all",
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

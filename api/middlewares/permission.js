class Permission {
  ENUM = ["admin", "user"];
  constructor(role) {
    if(!this.ENUM.contains(role)){
      throw new Error("Role must be admin or user");
    }
    this.role = role;
  }

  has_role_permission() {}

  has_role_permissions() {}
}

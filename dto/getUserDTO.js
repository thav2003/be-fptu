module.exports = {
  dto: function (model) {
    const self = {
      id: model.id,
      name: model.name,
      email: model.email,
      photo: model.photo,
      role: model.role,
      password: model.password,
    };
    return self;
  },
};

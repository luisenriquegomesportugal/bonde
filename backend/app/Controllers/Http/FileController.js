"use strict";

const crypto = require("crypto");
const File = use("App/Models/File");
const Helpers = use("Helpers");

class FileController {
  async show({ params, response }) {
    try {
      const { file } = await File.findByOrFail("file", params.file);

      return response.download(Helpers.tmpPath(`uploads/${file}`));
    } catch (err) {
      return response.status(err.status).send({
        error: { message: "Algo não deu certo, esse arquivo existe?" }
      });
    }
  }

  async store({ request, response }) {
    try {
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });
      const name = `${Date.now()}_${crypto.randomBytes(15).toString("hex")}.${
        upload.subtype
      }`;

      await upload.move(Helpers.tmpPath("uploads"), { name });

      if (!upload.moved()) {
        throw upload.error();
      }

      const file = await File.create({
        file: name,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      });

      return file;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: "Error no upload de arquivo" } });
    }
  }
}

module.exports = FileController;

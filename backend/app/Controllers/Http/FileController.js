"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

const File = use("App/Models/File");
const Helpers = use("Helpers");

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  /**
   * Create/save a new file.
   * POST files
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    try {
      if (!request.file("file")) return;

      const upload = request.file("file", { size: "2mb" });
      const name = `${Date.now()}.${upload.subtype}`;

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

// utils/cloudinaryHelper.js
import { v2 as cloudinary } from "cloudinary"

export function getImagenUrl(imagen) {
    if (!imagen.copyright) {
        return imagen.img_path // la url original, sin transformación
    }

    const texto = imagen.texto_personalizado

    return cloudinary.url(imagen.nombre_img, {
        secure: true,
        transformation: [
            { width: 1000, crop: "limit" }, // normaliza el ancho máximo
            {
                overlay: {
                    font_family: "Arial",
                    font_size: 30,
                    font_weight: "bold",
                    text: texto
                },
                gravity: "center",
                opacity: 70,
                color: "white",
                effect: "shadow:50"
            }
        ]
    })
}
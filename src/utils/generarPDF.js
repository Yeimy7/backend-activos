import puppeteer from 'puppeteer'
import fs from "fs";
import hbs from 'handlebars'
import path from 'path'

const compile = async (templateName, data) => {
  const filePath = path.join(process.cwd(), '/templates', `${templateName}.hbs`);
  const html = fs.readFileSync(filePath, 'utf8');
  return hbs.compile(html)(data);
}

export const crearPDF = async (template, activos) => {
  let navegador = await puppeteer.launch();
  let pagina = await navegador.newPage();
  const content = await compile(template, { data: activos });
  await pagina.setContent(content);

  const pdf = await pagina.pdf({
    path: `./uploads/document.pdf`,
    format: 'letter',
    printBackground: true,
    margin: {
      top: '20mm',    // Márgenes superiores de 20mm
      right: '10mm',  // Márgenes derechos de 20mm
      bottom: '20mm', // Márgenes inferiores de 20mm
      left: '10mm',   // Márgenes izquierdos de 20mm
    },
  })

  console.log("done creating pdf")

  navegador.close();
  return pdf
}

import puppeteer from 'puppeteer'
import fs from "fs";
import hbs from 'handlebars'
import path from 'path'

const compile = async (templateName, data) => {
  const filePath = path.join(process.cwd(), 'src/templates', `${templateName}.hbs`);
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
    format: 'A4',
    printBackground: true
  })

  console.log("done creating pdf")

  navegador.close();
  return pdf
}

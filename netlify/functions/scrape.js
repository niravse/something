const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async function(event, context) {
  const page = event.queryStringParameters.page || '0';

  try {
    const url = `https://www.google.com/search?vet=10ahUKEwjOrdaa_-KGAxUd1gIHHVVnAZUQ06ACCJsO..i&ei=tltwZqDxGabgxc8Piuy3-AU&opi=89978449&rlz=1C1EJFC&yv=3&rciv=jb&nfpr=0&q=jobs&start=${page}0&asearch=jb_list&cs=1&async=_id:VoQFxe,_pms:hts,_fmt:pc`;
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const titles = $('div.BjJfJf.PUpOsf').map((i, el) => $(el).text().trim()).get();
    const jobElements = $('a.sMzDkb').map((i, el) => $(el).attr('href') || '').get();
    const descriptions = $('.HBvzbc').map((i, el) => $(el).text().trim()).get();
    const locations = $('div.tJ9zfc').map((i, el) => $(el).text().trim()).get();
    const companies = $('div.nJlQNd.sMzDkb').map((i, el) => $(el).text().trim()).get();
    const data = $('div.ocResc.KKh3md').map((i, el) => $(el).text().trim()).get();
    const names = $('div.acCJ4b > div > span > div > span > a > div > div > span').map((i, el) => $(el).text().trim()).get();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titles,
        jobElements,
        descriptions,
        locations,
        companies,
        data,
        names
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};

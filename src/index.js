function extractParams(url) {
  let queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  let obj = {};
  if (queryString) {
    queryString = queryString.split('#')[0];
    let arr = queryString.split('&');
    for (let i=0; i<arr.length; i++) {
      // separate the keys and the values
      let a = arr[i].split('=');
      let paramNum = undefined;
      let paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });
      let paramValue = typeof(a[1])==='undefined' ? true : a[1];
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

function extractReferral() {
  let referrerName = '';
  const referrer = document.referrer;
  const referrerDomainToNameMap = {
    'https://www.google.com/': 'google',
    'https://www.bing.com/': 'bing',
    'https://duckduckgo.com/': 'duckduckgo',
    'https://de.search.yahoo.com/': 'yahoo',
    'https://search.yahoo.com/': 'yahoo'
  };
  if (referrerDomainToNameMap[referrer]){
    referrerName = referrerDomainToNameMap[referrer];
  }

  return referrerName;
}

class UTMHandler {

  constructor(storageKey='utm_history') {
    this.storageKey = storageKey;
  }

  extractUTM(url) {
    const params = extractParams(url);
    const date = new Date().toISOString();
    const data = {
      date: date,
      utm_source: params.utm_source,
      utm_medium: params.utm_medium,
      utm_campaign: params.utm_campaign,
      utm_term: params.utm_term,
      utm_content: params.utm_content,
      utm_name: params.utm_name,
    };
    return data.utm_source !== undefined ? data : null;
  }

  get history() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  set history(value) {
    localStorage.setItem(this.storageKey, JSON.stringify(value));
  }

  checkReferral() {
    const referral = extractReferral();
    const date = new Date().toISOString();
    const utm_medium = 'organic';
    const data = {
      date: date,
      utm_source: referral,
      utm_medium: utm_medium
    };

    return (referral === "" || referral === undefined) ? null : data;
  }

  saveHistory(data) {
    if (data) {
      const history = this.history;
      history.push(data);
      this.history = history;
    }
  }

  processUTM(url) {
    const data = this.extractUTM(url);
    this.saveHistory(data);
  }

  processReferral(url) {
    const hasNoUTM = this.extractUTM(url) == null;
    if (hasNoUTM) {
      const data = this.checkReferral();
      this.saveHistory(data);
    }
  }
}


export { UTMHandler };
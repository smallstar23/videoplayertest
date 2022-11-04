
// common fn
const format = (seconds) =>{
    if(isNaN(seconds)){
      return '00:00'
    }
  
    const date= new Date(seconds * 1000);
    const hh= date.getUTCHours();
    const mm= date.getUTCMinutes();
    const ss= date.getUTCSeconds().toString().padStart(2, '0');
    if(hh){
      return `${hh}:${mm.toString().padStart(2,'0')}:${ss}`
    }
  
    return `${mm}:${ss}`
  
  
  };
  
  
  function makeDateFn(date) {
    let newdate = new Date();
    newdate.setDate(date[2]);
    newdate.setMonth(date[1]);
    newdate.setFullYear(date[0]);
    let yyyy = newdate.getFullYear();
    let mm = newdate.getMonth();
    if (mm < 10) {
      mm = '0' + mm;
    }
  
    let dd = newdate.getDate();
    if (dd < 10) {
      dd = '0' + dd;
    }
    let result = yyyy + '-' + mm + '-' + dd;
    return result;
  };
  
  const getByteSize = (size) => {
    const byteUnits = ['KB', 'MB', 'GB', 'TB'];
  
    for (let i = 0; i < byteUnits.length; i++) {
      size = (size / 1024);
  
      if (size < 1024) return size.toFixed(1) + byteUnits[i];
    }
  };
  
  
  const commonFn={
    format,
    makeDateFn,
    getByteSize
  }
  
  export default commonFn;
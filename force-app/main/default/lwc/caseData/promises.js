function promiseExample() {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @lwc/lwc/no-async-operation
      setTimeout(() => {
        resolve('Promise resolved after 2 seconds!');
      }, 2000);
    });
  }
  
  promiseExample()
    .then(message => {
      console.log(message);
    });
  
  promiseExample();
const arr = [
    { name: "maxim", id: "1" },
    { name: "lolo", id: "2" },
    { name: "david", id: "3" }
  ];
  
  const objToFind = { name: "axim", id: "1" };
  
  const index = arr.findIndex(item => item.name === objToFind.name && item.id === objToFind.id);
  
  console.log(index); 
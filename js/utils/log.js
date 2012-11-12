window.log = function() {
  log.history = log.history || [];
  log.history.push(arguments);
  if (window.console) {
    window.console.log.apply(window.console, arguments);
  }
};
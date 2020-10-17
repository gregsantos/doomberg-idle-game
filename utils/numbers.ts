const whole = (input) => {
  var output = Math.round(input * 1000000) / 1000000
  return Math.round(output)
}

export { whole }

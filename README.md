# riotjs-redux

connecter for riot to redux  (react like).

##Usage
```html
<foo>
  <div>
    <span>{ opts.count }</span>
    <button onclick="{ opts.increase }"></button>
  <div>
  
  import { connect } from 'riotjs-redux';
  
  const mapStateToOpts = state => ({
    count: state.count
  })
  
  const mapActionToOpts = dispatch => ({
    increase: dispatch({type: 'increase', payload: 1})
  })
  
  connect(mapStateToOpts, mapActionToOpts)(this);
</foo>
```



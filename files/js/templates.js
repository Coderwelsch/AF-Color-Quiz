(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['choose-btn'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"choose-btn\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});
templates['game-interface'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "style=\"background: #"
    + alias4(((helper = (helper = helpers["first-color"] || (depth0 != null ? depth0["first-color"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"first-color","hash":{},"data":data}) : helper)))
    + ";\" data-accepts-value=\""
    + alias4(((helper = (helper = helpers["first-color"] || (depth0 != null ? depth0["first-color"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"first-color","hash":{},"data":data}) : helper)))
    + "\"";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "style=\"background: #"
    + alias4(((helper = (helper = helpers["second-color"] || (depth0 != null ? depth0["second-color"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"second-color","hash":{},"data":data}) : helper)))
    + ";\" data-accepts-value=\""
    + alias4(((helper = (helper = helpers["second-color"] || (depth0 != null ? depth0["second-color"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"second-color","hash":{},"data":data}) : helper)))
    + "\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"game-interface view\">\n    <div class=\"game-over-view\">\n        <div class=\"wrapper\">\n            <h1>Spiel vorbei!</h1>\n            <p class=\"content\"></p>\n            <div class=\"btn reload\"></div>\n        </div>\n    </div>\n\n    <div class=\"header-view\">\n        <div class=\"logo\">\n            <div>C</div>\n            <div>Q</div>\n        </div>\n\n        <div class=\"buttons\">\n            <div class=\"btn play\"></div>\n            <div class=\"btn reload\"></div>\n        </div>\n    </div>\n\n    <div class=\"body-view\">\n        <div class=\"main-view\">\n            <div class=\"game-board\">\n                <div class=\"wrapper\">\n                    <div class=\"time-board\">\n                        <span class=\"seconds\">60</span>\n                        <span class=\"suffix\"> Sek.</span>\n                    </div>\n\n                    <div class=\"score-bard\">\n                        <div class=\"value\">0000</div>\n                        <div class=\"label\">Punkte</div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"big-tiles-container tiles-container\">\n                <div class=\"tile first-color\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["first-color"] : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                    <div class=\"label\"></div>\n                </div>\n\n                <div class=\"tile second-color\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["second-color"] : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">\n                    <div class=\"label\"></div>\n                </div>\n            </div>\n\n            <div class=\"choose-view\">\n\n            </div>\n        </div>\n\n        <div class=\"tiles-view\">\n\n        </div>\n    </div>\n</div>\n";
},"useData":true});
templates['logo'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"logo\">\n    <div>C</div>\n    <div>Q</div>\n</div>\n";
},"useData":true});
templates['preloader'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"view preloader\">\n    <div class=\"logo\">\n        <div>C</div>\n        <div>Q</div>\n    </div>\n\n    <div class=\"progress-animation\">\n        <div class=\"dot\"></div>\n        <div class=\"dot\"></div>\n        <div class=\"dot\"></div>\n    </div>\n</div>\n";
},"useData":true});
templates['tile'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper;

  return "background: #"
    + container.escapeExpression(((helper = (helper = helpers["first-color"] || (depth0 != null ? depth0["first-color"] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"first-color","hash":{},"data":data}) : helper)))
    + ";";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "background: #"
    + container.escapeExpression(((helper = (helper = helpers["second-color"] || (depth0 != null ? depth0["second-color"] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"second-color","hash":{},"data":data}) : helper)))
    + ";";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"tiles-wrapper\" data-id=\""
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"tiles-container\">\n        <div class=\"tile first-color\" style=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["first-color"] : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"></div>\n        <div class=\"tile second-color\" style=\""
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0["second-color"] : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\"></div>\n    </div>\n</div>\n";
},"useData":true});
})();
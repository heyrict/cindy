(function($) {
  $.fn.htmlClean = function(options) {
    return this.each(function() {
      if (this.value) {
        this.value = $.htmlClean(this.value, options);
      } else {
        this.innerHTML = $.htmlClean(this.innerHTML, options);
      }
    });
  };
  $.htmlClean = function(html, options) {
    options = $.extend({}, $.htmlClean.defaults, options);
    options.allowEmpty = tagAllowEmpty.concat(options.allowEmpty);
    var tagsRE = /(<(\/)?(\w+:)?([\w]+)([^>]*)>)|<!--(.*?--)>/gi;
    var attrsRE = /([\w\-]+)\s*=\s*(".*?"|'.*?'|[^\s>\/]*)/gi;
    var tagMatch;
    var root = new Element();
    var stack = [root];
    var container = root;
    if (options.bodyOnly) {
      if ((tagMatch = /<body[^>]*>((\n|.)*)<\/body>/i.exec(html))) {
        html = tagMatch[1];
      }
    }
    html = html.concat("<xxx>");
    var lastIndex;
    while ((tagMatch = tagsRE.exec(html))) {
      var tag = tagMatch[6]
        ? new Tag("--", null, tagMatch[6], options)
        : new Tag(tagMatch[4], tagMatch[2], tagMatch[5], options);
      var text = html.substring(lastIndex, tagMatch.index);
      if (text.length > 0) {
        var child = container.children[container.children.length - 1];
        if (
          container.children.length > 0 &&
          isText((child = container.children[container.children.length - 1]))
        ) {
          container.children[container.children.length - 1] = child.concat(
            text
          );
        } else {
          container.children.push(text);
        }
      }
      lastIndex = tagsRE.lastIndex;
      if (tag.isClosing) {
        if (popToTagName(stack, [tag.name])) {
          stack.pop();
          container = stack[stack.length - 1];
        }
      } else {
        var element = new Element(tag);
        var attrMatch;
        while ((attrMatch = attrsRE.exec(tag.rawAttributes))) {
          if (attrMatch[1].toLowerCase() == "style" && options.replaceStyles) {
            var renderParent = !tag.isInline;
            for (var i = 0; i < options.replaceStyles.length; i++) {
              if (options.replaceStyles[i][0].test(attrMatch[2])) {
                if (!renderParent) {
                  tag.render = false;
                  renderParent = true;
                }
                container.children.push(element);
                stack.push(element);
                container = element;
                tag = new Tag(options.replaceStyles[i][1], "", "", options);
                element = new Element(tag);
              }
            }
          }
          /*if (
            tag.allowedAttributes != null &&
            (tag.allowedAttributes.length == 0 ||
              $.inArray(attrMatch[1], tag.allowedAttributes) > -1)
          ) {
            element.attributes.push(new Attribute(attrMatch[1], attrMatch[2]));
          }*/
          element.attributes.push(new Attribute(attrMatch[1], attrMatch[2]));
        }
        $.each(tag.requiredAttributes, function() {
          var name = this.toString();
          if (!element.hasAttribute(name)) {
            element.attributes.push(new Attribute(name, ""));
          }
        });
        for (var repIndex = 0; repIndex < options.replace.length; repIndex++) {
          for (
            var tagIndex = 0;
            tagIndex < options.replace[repIndex][0].length;
            tagIndex++
          ) {
            var byName =
              typeof options.replace[repIndex][0][tagIndex] == "string";
            if (
              (byName && options.replace[repIndex][0][tagIndex] == tag.name) ||
              (!byName && options.replace[repIndex][0][tagIndex].test(tagMatch))
            ) {
              tag.rename(options.replace[repIndex][1]);
              repIndex = options.replace.length;
              break;
            }
          }
        }
        var add = true;
        if (!container.isRoot) {
          if (container.tag.isInline && !tag.isInline) {
            if ((add = popToContainer(stack))) {
              container = stack[stack.length - 1];
            }
          } else {
            if (
              container.tag.disallowNest &&
              tag.disallowNest &&
              !tag.requiredParent
            ) {
              add = false;
            } else {
              if (tag.requiredParent) {
                if ((add = popToTagName(stack, tag.requiredParent))) {
                  container = stack[stack.length - 1];
                }
              }
            }
          }
        }
        if (add) {
          container.children.push(element);
          if (tag.toProtect) {
            var tagMatch2;
            while ((tagMatch2 = tagsRE.exec(html))) {
              var tag2 = new Tag(
                tagMatch2[4],
                tagMatch2[1],
                tagMatch2[5],
                options
              );
              if (tag2.isClosing && tag2.name == tag.name) {
                element.children.push(RegExp.leftContext.substring(lastIndex));
                lastIndex = tagsRE.lastIndex;
                break;
              }
            }
          } else {
            if (!tag.isSelfClosing && !tag.isNonClosing) {
              stack.push(element);
              container = element;
            }
          }
        }
      }
    }
    return $.htmlClean.trim(render(root, options).join(""));
  };
  $.htmlClean.defaults = {
    bodyOnly: true,
    allowedTags: [],
    /*removeTags: [
      "basefont",
      "center",
      "dir",
      "font",
      "frame",
      "frameset",
      "iframe",
      "isindex",
      "menu",
      "noframes",
      "s",
      "strike",
      "u"
    ],*/
    removeTags: [],
    removeTagsAndContent: [],
    allowedAttributes: [],
    removeAttrs: [],
    allowedClasses: [],
    format: false,
    formatIndent: 0,
    replace: [[["b", "big"], "strong"], [["i"], "em"]],
    replaceStyles: [
      [/font-weight:\s*bold/i, "strong"],
      [/font-style:\s*italic/i, "em"],
      [/vertical-align:\s*super/i, "sup"],
      [/vertical-align:\s*sub/i, "sub"]
    ],
    allowComments: true,
    allowEmpty: []
  };
  function applyFormat(element, options, output, indent) {
    if (element.tag.format && output.length > 0) {
      output.push("\n");
      for (var i = 0; i < indent; i++) {
        output.push("\t");
      }
    }
  }
  function render(element, options) {
    var output = [],
      empty = element.attributes.length == 0,
      indent = 0;
    if (element.tag.isComment) {
      if (options.allowComments) {
        output.push("<!--");
        output.push(element.tag.rawAttributes);
        output.push(">");
        if (options.format) {
          applyFormat(element, options, output, indent - 1);
        }
      }
    } else {
      var renderChildren =
        options.removeTagsAndContent.length == 0 ||
        $.inArray(element.tag.name, options.removeTagsAndContent) == -1;
      var renderTag =
        renderChildren &&
        element.tag.render &&
        (options.allowedTags.length == 0 ||
          $.inArray(element.tag.name, options.allowedTags) > -1) &&
        (options.removeTags.length == 0 ||
          $.inArray(element.tag.name, options.removeTags) == -1);
      if (!element.isRoot && renderTag) {
        output.push("<");
        output.push(element.tag.name);
        $.each(element.attributes, function() {
          if ($.inArray(this.name, options.removeAttrs) == -1) {
            var m = RegExp(/^(['"]?)(.*?)['"]?$/).exec(this.value);
            var value = m[2];
            var valueQuote = m[1] || "'";
            if (this.name == "class" && options.allowedClasses.length > 0) {
              value = $.grep(value.split(" "), function(c) {
                return (
                  $.grep(options.allowedClasses, function(a) {
                    return (
                      a == c ||
                      (a[0] == c &&
                        (a.length == 1 ||
                          $.inArray(element.tag.name, a[1]) > -1))
                    );
                  }).length > 0
                );
              }).join(" ");
            }
            if (
              value != null &&
              (value.length > 0 ||
                $.inArray(this.name, element.tag.requiredAttributes) > -1)
            ) {
              output.push(" ");
              output.push(this.name);
              output.push("=");
              output.push(valueQuote);
              output.push(value);
              output.push(valueQuote);
            }
          }
        });
      }
      if (element.tag.isSelfClosing) {
        if (renderTag) {
          output.push(" />");
        }
        empty = false;
      } else {
        if (element.tag.isNonClosing) {
          empty = false;
        } else {
          if (renderChildren) {
            if (!element.isRoot && renderTag) {
              output.push(">");
            }
            indent = options.formatIndent++;
            if (element.tag.toProtect) {
              outputChildren = $.htmlClean
                .trim(element.children.join(""))
                .replace(/<br>/gi, "\n");
              output.push(outputChildren);
              empty = outputChildren.length == 0;
            } else {
              var outputChildren = [];
              for (var i = 0; i < element.children.length; i++) {
                var child = element.children[i];
                var text = $.htmlClean.trim(
                  textClean(isText(child) ? child : child.childrenToString())
                );
                if (isInline(child)) {
                  if (
                    i > 0 &&
                    text.length > 0 &&
                    (startsWithWhitespace(child) ||
                      endsWithWhitespace(element.children[i - 1]))
                  ) {
                    outputChildren.push(" ");
                  }
                }
                if (isText(child)) {
                  if (text.length > 0) {
                    outputChildren.push(text);
                  }
                } else {
                  if (
                    i != element.children.length - 1 ||
                    child.tag.name != "br"
                  ) {
                    if (options.format) {
                      applyFormat(child, options, outputChildren, indent);
                    }
                    outputChildren = outputChildren.concat(
                      render(child, options)
                    );
                  }
                }
              }
              options.formatIndent--;
              if (outputChildren.length > 0) {
                if (options.format && outputChildren[0] != "\n") {
                  applyFormat(element, options, output, indent);
                }
                output = output.concat(outputChildren);
                empty = false;
              }
            }
            if (!element.isRoot && renderTag) {
              if (options.format) {
                applyFormat(element, options, output, indent - 1);
              }
              output.push("</");
              output.push(element.tag.name);
              output.push(">");
            }
          }
        }
      }
      if (!element.tag.allowEmpty && empty) {
        return [];
      }
    }
    return output;
  }
  function popToTagName(stack, tagNameArray) {
    return pop(stack, function(element) {
      return $.inArray(element.tag.nameOriginal, tagNameArray) > -1;
    });
  }
  function popToContainer(stack) {
    return pop(stack, function(element) {
      return element.isRoot || !element.tag.isInline;
    });
  }
  function pop(stack, test, index) {
    index = index || 1;
    var element = stack[stack.length - index];
    if (test(element)) {
      return true;
    } else {
      if (stack.length - index > 0 && pop(stack, test, index + 1)) {
        stack.pop();
        return true;
      }
    }
    return false;
  }
  function Element(tag) {
    if (tag) {
      this.tag = tag;
      this.isRoot = false;
    } else {
      this.tag = new Tag("root");
      this.isRoot = true;
    }
    this.attributes = [];
    this.children = [];
    this.hasAttribute = function(name) {
      for (var i = 0; i < this.attributes.length; i++) {
        if (this.attributes[i].name == name) {
          return true;
        }
      }
      return false;
    };
    this.childrenToString = function() {
      return this.children.join("");
    };
    return this;
  }
  function Attribute(name, value) {
    this.name = name;
    this.value = value;
    return this;
  }
  function Tag(name, close, rawAttributes, options) {
    this.name = name.toLowerCase();
    this.nameOriginal = this.name;
    this.render = true;
    this.init = function() {
      if (this.name == "--") {
        this.isComment = true;
        this.isSelfClosing = true;
        this.format = true;
      } else {
        this.isComment = false;
        this.isSelfClosing = $.inArray(this.name, tagSelfClosing) > -1;
        this.isNonClosing = $.inArray(this.name, tagNonClosing) > -1;
        this.isClosing = close != undefined && close.length > 0;
        this.isInline = $.inArray(this.name, tagInline) > -1;
        this.disallowNest = $.inArray(this.name, tagDisallowNest) > -1;
        this.requiredParent =
          tagRequiredParent[$.inArray(this.name, tagRequiredParent) + 1];
        this.allowEmpty =
          options && $.inArray(this.name, options.allowEmpty) > -1;
        this.toProtect = $.inArray(this.name, tagProtect) > -1;
        this.format = $.inArray(this.name, tagFormat) > -1 || !this.isInline;
      }
      this.rawAttributes = rawAttributes;
      this.requiredAttributes =
        tagAttributesRequired[$.inArray(this.name, tagAttributesRequired) + 1];
      if (options) {
        if (!options.tagAttributesCache) {
          options.tagAttributesCache = [];
        }
        if ($.inArray(this.name, options.tagAttributesCache) == -1) {
          var cacheItem = tagAttributes[
            $.inArray(this.name, tagAttributes) + 1
          ].slice(0);
          for (var i = 0; i < options.allowedAttributes.length; i++) {
            var attrName = options.allowedAttributes[i][0];
            if (
              (options.allowedAttributes[i].length == 1 ||
                $.inArray(this.name, options.allowedAttributes[i][1]) > -1) &&
              $.inArray(attrName, cacheItem) == -1
            ) {
              cacheItem.push(attrName);
            }
          }
          options.tagAttributesCache.push(this.name);
          options.tagAttributesCache.push(cacheItem);
        }
        this.allowedAttributes =
          options.tagAttributesCache[
            $.inArray(this.name, options.tagAttributesCache) + 1
          ];
      }
    };
    this.init();
    this.rename = function(newName) {
      this.name = newName;
      this.init();
    };
    return this;
  }
  function startsWithWhitespace(item) {
    while (isElement(item) && item.children.length > 0) {
      item = item.children[0];
    }
    if (!isText(item)) {
      return false;
    }
    var text = textClean(item);
    return text.length > 0 && $.htmlClean.isWhitespace(text.charAt(0));
  }
  function endsWithWhitespace(item) {
    while (isElement(item) && item.children.length > 0) {
      item = item.children[item.children.length - 1];
    }
    if (!isText(item)) {
      return false;
    }
    var text = textClean(item);
    return (
      text.length > 0 && $.htmlClean.isWhitespace(text.charAt(text.length - 1))
    );
  }
  function isText(item) {
    return item.constructor == String;
  }
  function isInline(item) {
    return isText(item) || item.tag.isInline;
  }
  function isElement(item) {
    return item.constructor == Element;
  }
  function textClean(text) {
    return text.replace(/&nbsp;|\n/g, " ").replace(/\s\s+/g, " ");
  }
  $.htmlClean.trim = function(text) {
    return $.htmlClean.trimStart($.htmlClean.trimEnd(text));
  };
  $.htmlClean.trimStart = function(text) {
    return text.substring($.htmlClean.trimStartIndex(text));
  };
  $.htmlClean.trimStartIndex = function(text) {
    for (
      var start = 0;
      start < text.length - 1 && $.htmlClean.isWhitespace(text.charAt(start));
      start++
    ) {}
    return start;
  };
  $.htmlClean.trimEnd = function(text) {
    return text.substring(0, $.htmlClean.trimEndIndex(text));
  };
  $.htmlClean.trimEndIndex = function(text) {
    for (
      var end = text.length - 1;
      end >= 0 && $.htmlClean.isWhitespace(text.charAt(end));
      end--
    ) {}
    return end + 1;
  };
  $.htmlClean.isWhitespace = function(c) {
    return $.inArray(c, whitespace) != -1;
  };
  var tagInline = [
    "a",
    "abbr",
    "acronym",
    "address",
    "b",
    "big",
    "br",
    "button",
    "caption",
    "cite",
    "code",
    "del",
    "em",
    "font",
    "hr",
    "i",
    "input",
    "img",
    "ins",
    "label",
    "legend",
    "map",
    "q",
    "s",
    "samp",
    "select",
    "option",
    "param",
    "small",
    "span",
    "strike",
    "strong",
    "sub",
    "sup",
    "tt",
    "u",
    "var"
  ];
  var tagFormat = [
    "address",
    "button",
    "caption",
    "code",
    "input",
    "label",
    "legend",
    "select",
    "option",
    "param"
  ];
  var tagDisallowNest = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "th",
    "td",
    "object"
  ];
  var tagAllowEmpty = ["th", "td"];
  var tagRequiredParent = [
    null,
    "li",
    ["ul", "ol"],
    "dt",
    ["dl"],
    "dd",
    ["dl"],
    "td",
    ["tr"],
    "th",
    ["tr"],
    "tr",
    ["table", "thead", "tbody", "tfoot"],
    "thead",
    ["table"],
    "tbody",
    ["table"],
    "tfoot",
    ["table"],
    "param",
    ["object"]
  ];
  //var tagProtect = ["script", "style", "pre", "code"];
  var tagProtect = [];
  var tagSelfClosing = [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ];
  var tagNonClosing = ["!doctype", "?xml"];
  var tagAttributes = [
    ["class"],
    "?xml",
    [],
    "!doctype",
    [],
    "a",
    [
      "accesskey",
      "class",
      "href",
      "name",
      "title",
      "rel",
      "rev",
      "type",
      "tabindex"
    ],
    "abbr",
    ["class", "title"],
    "acronym",
    ["class", "title"],
    "blockquote",
    ["cite", "class"],
    "button",
    ["class", "disabled", "name", "type", "value"],
    "del",
    ["cite", "class", "datetime"],
    "form",
    ["accept", "action", "class", "enctype", "method", "name"],
    "iframe",
    [
      "class",
      "height",
      "name",
      "sandbox",
      "seamless",
      "src",
      "srcdoc",
      "width"
    ],
    "input",
    [
      "accept",
      "accesskey",
      "alt",
      "checked",
      "class",
      "disabled",
      "ismap",
      "maxlength",
      "name",
      "size",
      "readonly",
      "src",
      "tabindex",
      "type",
      "usemap",
      "value"
    ],
    "img",
    ["alt", "class", "height", "src", "width"],
    "ins",
    ["cite", "class", "datetime"],
    "label",
    ["accesskey", "class", "for"],
    "legend",
    ["accesskey", "class"],
    "link",
    ["href", "rel", "type"],
    "meta",
    ["content", "http-equiv", "name", "scheme", "charset"],
    "map",
    ["name"],
    "optgroup",
    ["class", "disabled", "label"],
    "option",
    ["class", "disabled", "label", "selected", "value"],
    "q",
    ["class", "cite"],
    "script",
    ["src", "type"],
    "select",
    ["class", "disabled", "multiple", "name", "size", "tabindex"],
    "style",
    ["type"],
    "table",
    ["class", "summary"],
    "th",
    ["class", "colspan", "rowspan"],
    "td",
    ["class", "colspan", "rowspan"],
    "textarea",
    [
      "accesskey",
      "class",
      "cols",
      "disabled",
      "name",
      "readonly",
      "rows",
      "tabindex"
    ],
    "param",
    ["name", "value"],
    "embed",
    ["height", "src", "type", "width"]
  ];
  var tagAttributesRequired = [[], "img", ["alt"]];
  var whitespace = [" ", " ", "\t", "\n", "\r", "\f"];
})(jQuery);

    H5.define("Newtonsoft.Json.JsonConvert", {
        statics: {
            methods: {
                stringify: function (value, formatting, settings) {
                    if (formatting === Newtonsoft.Json.Formatting.Indented) {
                        return JSON.stringify(value, null, "  ");
                    }

                    return JSON.stringify(value);
                },

                parse: function (value) {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        if (e instanceof SyntaxError) {
                            try {
                                return eval('(' + value + ')');
                            } catch (e) {
                                throw new Newtonsoft.Json.JsonException(e.message);
                            }
                        }
                        throw new Newtonsoft.Json.JsonException(e.message);
                    }
                },

                getEnumerableElementType: function (type) {
                    var interfaceType;
                    if (System.String.startsWith(type.$$name, "System.Collections.Generic.IEnumerable")) {
                        interfaceType = type;
                    } else {
                        var interfaces = H5.Reflection.getInterfaces(type);

                        for (var j = 0; j < interfaces.length; j++) {
                            if (System.String.startsWith(interfaces[j].$$name, "System.Collections.Generic.IEnumerable")) {
                                interfaceType = interfaces[j];
                                break;
                            }
                        }
                    }

                    return interfaceType ? H5.Reflection.getGenericArguments(interfaceType)[0] : null;
                },

                validateReflectable: function (type) {
                    do {
                        var ignoreMetaData = type === System.Object || type === Object || type.$literal || type.$kind === "anonymous",
                            nometa = !H5.getMetadata(type);

                        if (!ignoreMetaData && nometa) {
                            if (H5.$jsonGuard) {
                                delete H5.$jsonGuard;
                            }

                            throw new System.InvalidOperationException(H5.getTypeName(type) + " is not reflectable and cannot be serialized.");
                        }
                        type = ignoreMetaData ? null : H5.Reflection.getBaseType(type);
                    } while (!ignoreMetaData && type != null)
                },

                defaultGuard: function () {
                    H5.$jsonGuard && H5.$jsonGuard.pop();
                },

                getValue: function (obj, name) {
                    name = name.toLowerCase();
                    for (var key in obj) {
                        if (key.toLowerCase() == name) {
                            return obj[key];
                        }
                    }
                },

                getCacheByType: function (type) {
                    for (var i = 0; i < Newtonsoft.Json.$cache.length; i++) {
                        var t = Newtonsoft.Json.$cache[i];

                        if (t.type === type) {
                            return t;
                        }
                    }

                    var cfg = {type: type};
                    Newtonsoft.Json.$cache.push(cfg);

                    return cfg;
                },

                getMembers: function (type, memberCode) {
                    var cache = Newtonsoft.Json.JsonConvert.getCacheByType(type);

                    if (cache[memberCode]) {
                        return cache[memberCode];
                    }

                    var members = H5.Reflection.getMembers(type, memberCode, 52),
                        hasOrder = false;

                    members = members.map(function (m) {
                        var attr = System.Attribute.getCustomAttributes(m, Newtonsoft.Json.JsonPropertyAttribute),
                            defValueAttr = System.Attribute.getCustomAttributes(m, System.ComponentModel.DefaultValueAttribute);

                        return {
                            member: m,
                            attr: attr && attr.length > 0 ? attr[0] : null,
                            defaultValue: defValueAttr && defValueAttr.length > 0 ? defValueAttr[0].Value : H5.getDefaultValue(m.rt)
                        };
                    }).filter(function (cfg) {
                        if (!hasOrder && cfg.attr && cfg.attr.Order) {
                            hasOrder = true;
                        }

                        return (cfg.attr || cfg.member.a === 2) && System.Attribute.getCustomAttributes(cfg.member, Newtonsoft.Json.JsonIgnoreAttribute).length === 0;
                    });

                    if (hasOrder) {
                        members.sort(function (a, b) {
                            return ((a.attr && a.attr.Order) || 0) - ((b.attr && b.attr.Order) || 0);
                        });
                    }

                    cache[memberCode] = members;
                    return members;
                },

                preRawProcess: function (cfg, instance, value, settings) {
                    var attr = cfg.attr,
                        defaultValueHandling = attr && attr._defaultValueHandling != null ? attr._defaultValueHandling : settings.DefaultValueHandling,
                        required = attr && attr.Required;

                    if (value === undefined && (defaultValueHandling === Newtonsoft.Json.DefaultValueHandling.Populate || defaultValueHandling === Newtonsoft.Json.DefaultValueHandling.IgnoreAndPopulate)) {
                        value = cfg.defaultValue;
                    }

                    if ((required === Newtonsoft.Json.Required.AllowNull || required === Newtonsoft.Json.Required.Always) && value === undefined) {
                        throw new Newtonsoft.Json.JsonSerializationException("Required property '" + cfg.member.n + "' not found in JSON.");
                    }

                    if (required === Newtonsoft.Json.Required.Always && value === null) {
                        throw new Newtonsoft.Json.JsonSerializationException("Required property '" + cfg.member.n + "' expects a value but got null.");
                    }

                    if (required === Newtonsoft.Json.Required.DisallowNull && value === null) {
                        throw new Newtonsoft.Json.JsonSerializationException("Property '" + cfg.member.n + "' expects a value but got null.");
                    }

                    return { value: value };
                },

                preProcess: function (cfg, instance, value, settings) {
                    var attr = cfg.attr,
                        defaultValueHandling = attr && attr._defaultValueHandling != null ? attr._defaultValueHandling : settings.DefaultValueHandling,
                        nullValueHandling = attr && attr._nullValueHandling != null ? attr._nullValueHandling : settings.NullValueHandling;

                    if (value == null && nullValueHandling === Newtonsoft.Json.NullValueHandling.Ignore) {
                        return false;
                    }

                    var x = H5.unbox(value, true),
                        y = cfg.defaultValue,
                        oneNull = x == null || y == null && !(x == null && y == null);

                    if (!oneNull && H5.equals(x, y) && (defaultValueHandling === Newtonsoft.Json.DefaultValueHandling.Ignore || defaultValueHandling === Newtonsoft.Json.DefaultValueHandling.IgnoreAndPopulate)) {
                        return false;
                    }

                    return {value: value};
                },

                PopulateObject: function (value, target, settings, schema) {
                    settings = settings || {};
                    var targetType = H5.getType(target);

                    var raw;

                    if (typeof value === "string") {
                        raw = Newtonsoft.Json.JsonConvert.parse(value);
                    }
                    else {
                        raw = value;
                    }                    

                    if (targetType.$nullable) {
                        targetType = targetType.$nullableType;
                    }

                    if (raw != null && typeof raw === "object") {
                        if (H5.isArray(null, targetType)) {
                            if (raw.length === undefined) {
                                return;
                            }

                            for (var i = 0; i < raw.length; i++) {
                                target.push(Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], targetType.$elementType, settings, true));
                            }
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IDictionary, targetType)) {
                            var typesGeneric = System.Collections.Generic.Dictionary$2.getTypeParameters(targetType),
                                typeKey = typesGeneric[0] || System.Object,
                                typeValue = typesGeneric[1] || System.Object,
                                keys;

                            if (H5.is(raw, System.Collections.IDictionary)) {
                                keys = System.Linq.Enumerable.from(raw.getKeys()).ToArray()
                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i];
                                    target.setItem(Newtonsoft.Json.JsonConvert.DeserializeObject(key, typeKey, settings, true), Newtonsoft.Json.JsonConvert.DeserializeObject(raw.get(key), typeValue, settings, true), false);
                                }
                            }
                            else {
                                for (var each in raw) {
                                    if (raw.hasOwnProperty(each)) {
                                        target.setItem(Newtonsoft.Json.JsonConvert.DeserializeObject(each, typeKey, settings, true), Newtonsoft.Json.JsonConvert.DeserializeObject(raw[each], typeValue, settings, true), false);
                                    }
                                }
                            }
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IList, targetType) || H5.Reflection.isAssignableFrom(System.Collections.ICollection, targetType)) {
                            var typeElement = System.Collections.Generic.List$1.getElementType(targetType) || System.Object;

                            if (!H5.isArray(raw)) {
                                raw = raw.ToArray ? raw.ToArray() : H5.Collections.EnumerableHelpers.ToArray(typeElement, raw);
                            }                            

                            for (var i = 0; i < raw.length; i++) {
                                target.add(Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], typeElement, settings, true));
                            }
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.Generic.ISet$1, targetType)) {
                            var typeElement = H5.Reflection.getGenericArguments(targetType)[0] || System.Object;

                            if (!H5.isArray(raw)) {
                                raw = raw.ToArray ? raw.ToArray() : H5.Collections.EnumerableHelpers.ToArray(typeElement, raw);
                            }

                            for (var i = 0; i < raw.length; i++) {
                                target.add(Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], typeElement, settings, true));
                            }
                        } else {
                            var camelCase = settings && H5.is(settings.ContractResolver, Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver),
                                fields = Newtonsoft.Json.JsonConvert.getMembers(targetType, 4),
                                properties = Newtonsoft.Json.JsonConvert.getMembers(targetType, 16),
                                value,
                                cfg,
                                f,
                                p,
                                mname,
                                i;

                            for (i = 0; i < fields.length; i++) {
                                cfg = fields[i];
                                f = cfg.member;

                                mname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (f.n.charAt(0).toLowerCase() + f.n.substr(1)) : f.n);

                                value = raw[mname];

                                if (value === undefined) {
                                    value = Newtonsoft.Json.JsonConvert.getValue(raw, mname);
                                }

                                var inSchema = (schema || raw)[mname];

                                if (inSchema === undefined) {
                                    inSchema = Newtonsoft.Json.JsonConvert.getValue(schema || raw, mname);
                                }

                                var result = Newtonsoft.Json.JsonConvert.preRawProcess(cfg, schema || raw, inSchema, settings);
                                inSchema = result.value;

                                if (inSchema !== undefined) {
                                    var needSet = value === null || value === false || value === true || typeof value === "number" || typeof value === "string";
                                    var targetValue = H5.unbox(H5.Reflection.fieldAccess(f, target));
                                    var instance = Newtonsoft.Json.JsonConvert.DeserializeObject(value, f.rt, settings, true);

                                    var result = Newtonsoft.Json.JsonConvert.preProcess(cfg, target, targetValue, settings);

                                    if (result !== false) {
                                        targetValue = result.value;
                                        if (needSet || targetValue == null) {
                                            H5.Reflection.fieldAccess(f, target, instance);
                                        } else {
                                            Newtonsoft.Json.JsonConvert.PopulateObject(instance, targetValue, settings, value);
                                        }
                                    }                                                                        
                                }
                            }

                            for (i = 0; i < properties.length; i++) {
                                cfg = properties[i];
                                p = cfg.member;

                                mname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (p.n.charAt(0).toLowerCase() + p.n.substr(1)) : p.n);

                                value = raw[mname];

                                if (value === undefined) {
                                    value = Newtonsoft.Json.JsonConvert.getValue(raw, mname);
                                }

                                var inSchema = (schema || raw)[mname];

                                if (inSchema === undefined) {
                                    inSchema = Newtonsoft.Json.JsonConvert.getValue(schema || raw, mname);
                                }

                                var result = Newtonsoft.Json.JsonConvert.preRawProcess(cfg, schema || raw, inSchema, settings);
                                inSchema = result.value;

                                if (inSchema !== undefined) {
                                    var needSet = value === null || value === false || value === true || typeof value === "number" || typeof value === "string";
                                    var targetValue = H5.unbox(H5.Reflection.midel(p.g, target)());
                                    instance = Newtonsoft.Json.JsonConvert.DeserializeObject(value, p.rt, settings, true);

                                    var result = Newtonsoft.Json.JsonConvert.preProcess(cfg, target, targetValue, settings);

                                    if (result !== false) {
                                        targetValue = result.value;
                                        if (needSet || targetValue == null) {
                                            if (!!p.s) {
                                                H5.Reflection.midel(p.s, target)(instance);
                                            }
                                            else if (type.$kind === "anonymous") {
                                                target[p.n] = instance;
                                            }
                                        } else {
                                            Newtonsoft.Json.JsonConvert.PopulateObject(instance, targetValue, settings, value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                BindToName: function (settings, type) {
                    if (settings && settings.SerializationBinder && settings.SerializationBinder.Newtonsoft$Json$Serialization$ISerializationBinder$BindToName) {
                        var asm = {},
                            name = {};

                        settings.SerializationBinder.Newtonsoft$Json$Serialization$ISerializationBinder$BindToName(type, asm, name);
                        return name.v + (asm.v ? ", " + asm.v : "");
                    }

                    return H5.Reflection.getTypeQName(type);
                },

                BindToType: function (settings, fullName, objectType) {
                    var type;
                    if (settings && settings.SerializationBinder && settings.SerializationBinder.Newtonsoft$Json$Serialization$ISerializationBinder$BindToType) {
                        var type = Newtonsoft.Json.JsonConvert.SplitFullyQualifiedTypeName(fullName);

                        type = settings.SerializationBinder.Newtonsoft$Json$Serialization$ISerializationBinder$BindToType(type.assemblyName, type.typeName);
                    } else {
                        type = H5.Reflection.getType(fullName); 
                    }

                    if (!type) {
                        throw new Newtonsoft.Json.JsonSerializationException("Type specified in JSON '" + fullName + "' was not resolved."); 
                    }

                    if (objectType && !H5.Reflection.isAssignableFrom(objectType, type)) {
                        throw new Newtonsoft.Json.JsonSerializationException("Type specified in JSON '" + H5.Reflection.getTypeQName(type) + "' is not compatible with '" + H5.Reflection.getTypeQName(objectType) + "'."); 
                    }

                    return type;
                },

                SplitFullyQualifiedTypeName: function (fullyQualifiedTypeName) {
                    var assemblyDelimiterIndex = Newtonsoft.Json.JsonConvert.GetAssemblyDelimiterIndex(fullyQualifiedTypeName);

                    var typeName;
                    var assemblyName;

                    if (assemblyDelimiterIndex != null) {
                        typeName = Newtonsoft.Json.JsonConvert.Trim(fullyQualifiedTypeName, 0, System.Nullable.getValueOrDefault(assemblyDelimiterIndex, 0));
                        assemblyName = Newtonsoft.Json.JsonConvert.Trim(fullyQualifiedTypeName, ((System.Nullable.getValueOrDefault(assemblyDelimiterIndex, 0) + 1) | 0), ((((fullyQualifiedTypeName.length - System.Nullable.getValueOrDefault(assemblyDelimiterIndex, 0)) | 0) - 1) | 0));
                    } else {
                        typeName = fullyQualifiedTypeName;
                        assemblyName = null;
                    }

                    return {
                        typeName: typeName,
                        assemblyName: assemblyName
                    };
                },

                GetAssemblyDelimiterIndex: function (fullyQualifiedTypeName) {

                    var scope = 0;
                    for (var i = 0; i < fullyQualifiedTypeName.length; i = (i + 1) | 0) {
                        var current = fullyQualifiedTypeName.charCodeAt(i);
                        switch (current) {
                            case 91:
                                scope = (scope + 1) | 0;
                                break;
                            case 93:
                                scope = (scope - 1) | 0;
                                break;
                            case 44:
                                if (scope === 0) {
                                    return i;
                                }
                                break;
                        }
                    }

                    return null;
                },

                Trim: function (s, start, length) {
                    var end = (((start + length) | 0) - 1) | 0;
                    if (end >= s.length) {
                        throw new System.ArgumentOutOfRangeException.$ctor1("length");
                    }
                    for (; start < end; start = (start + 1) | 0) {
                        if (!System.Char.isWhiteSpace(String.fromCharCode(s.charCodeAt(start)))) {
                            break;
                        }
                    }
                    for (; end >= start; end = (end - 1) | 0) {
                        if (!System.Char.isWhiteSpace(String.fromCharCode(s.charCodeAt(end)))) {
                            break;
                        }
                    }
                    return s.substr(start, ((((end - start) | 0) + 1) | 0));
                },

                SerializeObject: function (obj, formatting, settings, returnRaw, possibleType, dictKey) {
                    if (H5.is(formatting, Newtonsoft.Json.JsonSerializerSettings)) {
                        settings = formatting;
                        formatting = 0;
                    }

                    if (obj == null) {
                        if (settings && settings.NullValueHandling === Newtonsoft.Json.NullValueHandling.Ignore) {
                            return;
                        }

                        return returnRaw ? null : Newtonsoft.Json.JsonConvert.stringify(null, formatting, settings);
                    }

                    var objType = H5.getType(obj);

                    if (possibleType && objType) {
                        if (possibleType.$kind === "interface" || H5.Reflection.isAssignableFrom(possibleType, objType)) {
                            possibleType = null;
                        }
                    }

                    if (possibleType && possibleType.$nullable) {
                        possibleType = possibleType.$nullableType;
                    }

                    if (possibleType && possibleType === System.Char) {
                        return String.fromCharCode(obj);
                    }

                    var type = possibleType || objType;

                    if (typeof obj === "function") {
                        var name = H5.getTypeName(obj);
                        return returnRaw ? name : Newtonsoft.Json.JsonConvert.stringify(name, formatting, settings);
                    } else if (typeof obj === "object") {
                        var arr,
                            i;

                        var removeGuard = Newtonsoft.Json.JsonConvert.defaultGuard;
                        if (!H5.$jsonGuard) {
                            H5.$jsonGuard = [];
                            removeGuard = function () {
                                delete H5.$jsonGuard;
                            };
                        }

                        if (H5.$jsonGuard.indexOf(obj) > -1) {
                            return;
                        }

                        if (type !== System.Globalization.CultureInfo &&
                            type !== System.Guid &&
                            type !== System.Uri &&
                            type !== System.Int64 &&
                            type !== System.UInt64 &&
                            type !== System.Decimal &&
                            type !== System.DateTime &&
                            type !== System.DateTimeOffset &&
                            type !== System.Char &&
                            !H5.Reflection.isEnum(type)) {
                            H5.$jsonGuard.push(obj);
                        } else {
                            removeGuard();
                        }

                        var wasBoxed = false;
                        if (obj && obj.$boxed) {
                            obj = H5.unbox(obj, true);
                            wasBoxed = true;
                        }

                        if (type === System.Globalization.CultureInfo) {
                            return returnRaw ? obj.name : Newtonsoft.Json.JsonConvert.stringify(obj.name, formatting, settings);
                        } else if (type === System.Guid) {
                            return returnRaw ? H5.toString(obj) : Newtonsoft.Json.JsonConvert.stringify(H5.toString(obj), formatting, settings);
                        } else if (type === System.Uri) {
                            return returnRaw ? obj.getAbsoluteUri() : Newtonsoft.Json.JsonConvert.stringify(obj.getAbsoluteUri(), formatting, settings);
                        } else if (type === System.Int64 || type === System.UInt64 || type === System.Decimal) {
                            return returnRaw ? obj.toJSON() : obj.toString();
                        } else if (type === System.DateTime) {
                            var d = System.DateTime.format(obj, "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK");
                            return returnRaw ? d : Newtonsoft.Json.JsonConvert.stringify(d, formatting, settings);
                        } else if (type === System.TimeSpan) {
                            var d = H5.toString(obj);
                            return returnRaw ? d : Newtonsoft.Json.JsonConvert.stringify(d, formatting, settings);
                        } else if (type === System.DateTimeOffset) {
                            var d = obj.ToString$1("yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFFK");
                            return returnRaw ? d : Newtonsoft.Json.JsonConvert.stringify(d, formatting, settings);
                        } else if (H5.isArray(null, type)) {
                            if (type.$elementType === System.Byte) {
                                removeGuard();
                                var json = System.Convert.toBase64String(obj);
                                return returnRaw ? json : Newtonsoft.Json.JsonConvert.stringify(json, formatting, settings);
                            }                            

                            arr = [];

                            for (i = 0; i < obj.length; i++) {
                                arr.push(Newtonsoft.Json.JsonConvert.SerializeObject(obj[i], formatting, settings, true, type.$elementType));
                            }

                            obj = arr;

                            if (settings && settings._typeNameHandling) {
                                var handling = settings._typeNameHandling,
                                    writeType = handling == 2 || handling == 3 || (handling == 4 && possibleType && possibleType !== objType);

                                if (writeType) {
                                    obj = {
                                        "$type": Newtonsoft.Json.JsonConvert.BindToName(settings, type),
                                        "$values": arr
                                    };
                                }
                            }
                        } else if (H5.Reflection.isEnum(type)) {
                            if (dictKey) {
                                return System.Enum.getName(type, obj);
                            }

                            return returnRaw ? obj : Newtonsoft.Json.JsonConvert.stringify(obj, formatting, settings);
                        } else if (type === System.Char) {
                            return returnRaw ? String.fromCharCode(obj) : Newtonsoft.Json.JsonConvert.stringify(String.fromCharCode(obj), formatting, settings);
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IDictionary, type)) {
                            var typesGeneric = System.Collections.Generic.Dictionary$2.getTypeParameters(type),
                                typeKey = typesGeneric[0],
                                typeValue = typesGeneric[1];

                            var dict = {},
                                enm = H5.getEnumerator(obj);

                            if (settings && settings._typeNameHandling) {
                                var handling = settings._typeNameHandling,
                                    writeType = handling == 1 || handling == 3 || (handling == 4 && possibleType && possibleType !== objType);

                                if (writeType) {
                                    dict["$type"] = Newtonsoft.Json.JsonConvert.BindToName(settings, type);
                                }
                            }

                            while (enm.moveNext()) {
                                var entr = enm.Current,
                                    keyJson = Newtonsoft.Json.JsonConvert.SerializeObject(entr.key, formatting, settings, true, typeKey, true);

                                if (typeof keyJson === "object") {
                                    keyJson = H5.toString(entr.key);
                                }

                                dict[keyJson] = Newtonsoft.Json.JsonConvert.SerializeObject(entr.value, formatting, settings, true, typeValue);
                            }                            

                            obj = dict;
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IEnumerable, type)) {
                            var typeElement = Newtonsoft.Json.JsonConvert.getEnumerableElementType(type),
                                enumerator = H5.getEnumerator(obj, typeElement);

                            arr = [];

                            while (enumerator.moveNext()) {
                                var item = enumerator.Current;
                                arr.push(Newtonsoft.Json.JsonConvert.SerializeObject(item, formatting, settings, true, typeElement));
                            }

                            obj = arr;

                            if (settings && settings._typeNameHandling) {
                                var handling = settings._typeNameHandling,
                                    writeType = handling == 2 || handling == 3 || (handling == 4 && possibleType && possibleType !== objType);

                                if (writeType) {
                                    obj = {
                                        "$type": Newtonsoft.Json.JsonConvert.BindToName(settings, type),
                                        "$values": arr
                                    };
                                }
                            }
                        } else if (!wasBoxed) {
                            var raw = {},
                                nometa = !H5.getMetadata(type);

                            Newtonsoft.Json.JsonConvert.validateReflectable(type);

                            if (settings && settings._typeNameHandling) {
                                var handling = settings._typeNameHandling,
                                    writeType = handling == 1 || handling == 3 || (handling == 4 && possibleType && possibleType !== objType);

                                if (writeType) {
                                    raw["$type"] = Newtonsoft.Json.JsonConvert.BindToName(settings, type);
                                }                                
                            }

                            if (nometa) {
                                if (obj.toJSON) {
                                    raw = obj.toJSON();
                                } else {
                                    for (var key in obj) {
                                        if (obj.hasOwnProperty(key)) {
                                            raw[key] = Newtonsoft.Json.JsonConvert.SerializeObject(obj[key], formatting, settings, true);
                                        }
                                    }
                                }
                            } else {
                                var fields = Newtonsoft.Json.JsonConvert.getMembers(type, 4),
                                    camelCase = settings && H5.is(settings.ContractResolver, Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver);

                                var methods = H5.Reflection.getMembers(type, 8, 54);

                                if (methods.length > 0) {
                                    for (var midx = 0; midx < methods.length; midx++) {
                                        if (System.Attribute.isDefined(methods[midx], System.Runtime.Serialization.OnSerializingAttribute, false)) {
                                            H5.Reflection.midel(methods[midx], obj)(null);
                                        }
                                    }                                    
                                }

                                for (i = 0; i < fields.length; i++) {
                                    var cfg = fields[i],
                                        f = cfg.member,
                                        fname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (f.n.charAt(0).toLowerCase() + f.n.substr(1)) : f.n),
                                        value = H5.Reflection.fieldAccess(f, obj);

                                    var result = Newtonsoft.Json.JsonConvert.preProcess(cfg, obj, value, settings || {});

                                    if (result !== false) {
                                        var typeNameHandling,
                                                oldTypeNameHandling;

                                        if (cfg.attr) {
                                            typeNameHandling = cfg.attr._typeNameHandling;
                                        }

                                        if (typeNameHandling != null) {
                                            settings = settings || {};
                                            oldTypeNameHandling = settings._typeNameHandling;
                                            settings._typeNameHandling = typeNameHandling;
                                        }

                                        raw[fname] = Newtonsoft.Json.JsonConvert.SerializeObject(result.value, formatting, settings, true, f.rt);

                                        if (typeNameHandling != null) {
                                            settings._typeNameHandling = oldTypeNameHandling;
                                        }
                                    }                                    
                                }

                                var properties = Newtonsoft.Json.JsonConvert.getMembers(type, 16);

                                for (i = 0; i < properties.length; i++) {
                                    var cfg = properties[i],
                                        p = cfg.member;
                                    if (!!p.g) {
                                        var pname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (p.n.charAt(0).toLowerCase() + p.n.substr(1)) : p.n),
                                            value = H5.Reflection.midel(p.g, obj)();

                                        var result = Newtonsoft.Json.JsonConvert.preProcess(cfg, obj, value, settings || {});

                                        if (result !== false) {
                                            var typeNameHandling,
                                                oldTypeNameHandling;

                                            if (cfg.attr) {
                                                typeNameHandling = cfg.attr._typeNameHandling;
                                            }

                                            if (typeNameHandling != null) {
                                                settings = settings || {};
                                                oldTypeNameHandling = settings._typeNameHandling;
                                                settings._typeNameHandling = typeNameHandling;
                                            }

                                            raw[pname] = Newtonsoft.Json.JsonConvert.SerializeObject(result.value, formatting, settings, true, p.rt);

                                            if (typeNameHandling != null) {
                                                settings._typeNameHandling = oldTypeNameHandling;
                                            }
                                        }
                                    }
                                }

                                if (methods.length > 0) {
                                    for (var midx = 0; midx < methods.length; midx++) {
                                        if (System.Attribute.isDefined(methods[midx], System.Runtime.Serialization.OnSerializedAttribute, false)) {
                                            H5.Reflection.midel(methods[midx], obj)(null);
                                            break;
                                        }
                                    }
                                }
                            }

                            obj = raw;
                        }

                        removeGuard();
                    } else if (H5.Reflection.isEnum(type)) {
                        if (dictKey) {
                            return System.Enum.getName(type, obj);
                        }

                        return returnRaw ? obj : Newtonsoft.Json.JsonConvert.stringify(obj, formatting, settings);
                    } 

                    return returnRaw ? obj : Newtonsoft.Json.JsonConvert.stringify(obj, formatting, settings);
                },

                getInstanceBuilder: function (type, raw, settings) {
                    var rawIsArray = H5.isArray(raw),
                        isEnumerable = rawIsArray && H5.Reflection.isAssignableFrom(System.Collections.IEnumerable, type),
                        isObject = typeof raw === "object" && !rawIsArray,
                        isList = false;

                    if (isEnumerable || isObject) {
                        var ctors = H5.Reflection.getMembers(type, 1, 54),
                            publicCtors = [],
                            hasDefault = false,
                            jsonCtor = null;

                         // little hack to get Version objects to deserialize correctly
                        if (type === System.Version) {
                            ctors = [H5.Reflection.getMembers(type, 1, 284, null, [System.Int32, System.Int32, System.Int32, System.Int32])];
                            jsonCtor = ctors[0];
                        }
                        else if (ctors.length > 0) {
                            ctors = ctors.filter(function (c) { return !c.isSynthetic; });

                            for (var idx = 0; idx < ctors.length; idx++) {
                                var c = ctors[idx],
                                    hasAttribute = System.Attribute.getCustomAttributes(c, Newtonsoft.Json.JsonConstructorAttribute).length > 0,
                                    isDefault = (c.pi || []).length === 0;

                                if (isDefault) {
                                    hasDefault = true;
                                }

                                if (hasAttribute) {
                                    if (jsonCtor != null) {
                                        throw new Newtonsoft.Json.JsonException("Multiple constructors with the JsonConstructorAttribute.");
                                    }

                                    jsonCtor = c;
                                }

                                if (c.a === 2) {
                                    publicCtors.push(c);
                                }
                            }
                        }

                        if (!hasDefault && !jsonCtor && type.$kind === "struct") {
                            var useDefault = true;
                            if (publicCtors.length > 0) {
                                useDefault = false;
                                jsonCtor = publicCtors[0];
                                var params = jsonCtor.pi || [],                                   
                                    fields = Newtonsoft.Json.JsonConvert.getMembers(type, 4),
                                    properties = Newtonsoft.Json.JsonConvert.getMembers(type, 16);

                                for (var i = 0; i < params.length; i++) {
                                    var prm = params[i],
                                        name = prm.sn || prm.n;

                                    for (var j = 0; j < properties.length; j++) {
                                        var cfg = properties[i],
                                            p = cfg.member,
                                            mname = cfg.attr && cfg.attr.PropertyName || p.n;

                                        if (name === mname || name.toLowerCase() === mname.toLowerCase() && cfg.s) {
                                            useDefault = true;
                                            break;
                                        }
                                    }

                                    if (!useDefault) {
                                        for (var j = 0; j < fields.length; j++) {
                                            var cfg = fields[i],
                                                f = cfg.member,
                                                mname = cfg.attr && cfg.attr.PropertyName || f.n;

                                            if (name === mname || name.toLowerCase() === mname.toLowerCase() && !cfg.ro) {
                                                useDefault = true;
                                                break;
                                            }
                                        }
                                    }

                                    if (useDefault) {
                                        break;
                                    }
                                }


                            }

                            if (useDefault) {
                                jsonCtor = { td: type };
                            }                            
                        }

                        if (!hasDefault && ctors.length > 0) {
                            if (publicCtors.length !== 1 && jsonCtor == null) {
                                throw new Newtonsoft.Json.JsonSerializationException("Unable to find a constructor to use for type " + H5.getTypeName(type) + ". A class should either have a default constructor or one constructor with arguments.");
                            }

                            if (jsonCtor == null) {
                                jsonCtor = publicCtors[0];
                            }

                            var params = jsonCtor.pi || [];

                            if (isEnumerable) {
                                return function (raw) {
                                    var args = [];
                                    if (H5.Reflection.isAssignableFrom(System.Collections.IEnumerable, params[0].pt)) {
                                        // Call getInstanceBuilder() just once and reuse it if the list of items are of the
                                        // same type. Requires TypeNameHandling to be enabled. This improves performance
                                        // on large sets of data.
                                        var arr = [],
                                            elementType = H5.Reflection.getGenericArguments(params[0].pt)[0] ||
                                                          H5.Reflection.getGenericArguments(type)[0] ||
                                                          System.Object,
                                            commonElementInstanceBuilder;
                                        if (settings && settings._typeNameHandling && raw.length > 0 && raw[0]) {
                                            var useSameInstanceBuilderForAllValues = true;
                                            var firstElementTypeName = raw[0].$type;
                                            if (!firstElementTypeName) {
                                                useSameInstanceBuilderForAllValues = false;
                                            }
                                            else {
                                                for (var i = 1; i < raw.length; i++) {
                                                    var nextElementTypeName = raw[i] ? raw[i].$type : null;
                                                    if (!nextElementTypeName || (nextElementTypeName !== firstElementTypeName)) {
                                                        useSameInstanceBuilderForAllValues = false;
                                                        break;
                                                    }
                                                }
                                            }
                                            if (useSameInstanceBuilderForAllValues) {
                                                commonElementInstanceBuilder = Newtonsoft.Json.JsonConvert.getInstanceBuilder(elementType, raw[0], settings);
                                            }
                                            else {
                                                commonElementInstanceBuilder = null;
                                            }
                                        }
                                        else {
                                            commonElementInstanceBuilder = null;
                                        }														
                                        for (var i = 0; i < raw.length; i++) {
                                            var item = raw[i],
                                                inst,
                                                names,
                                                useBuilder = commonElementInstanceBuilder && !commonElementInstanceBuilder.default;

                                            if (useBuilder) {
                                                inst = commonElementInstanceBuilder(item);
                                                arr[i] = inst.value;
                                                names = inst.names;
                                            }

                                            arr[i] = Newtonsoft.Json.JsonConvert.DeserializeObject(item, elementType, settings, true, useBuilder ? arr[i] : undefined, names);
                                        }
                                        args.push(arr);
                                        isList = true;
                                    }
                                    var v = H5.Reflection.invokeCI(jsonCtor, args);
                                    return isList ? { $list: true, names: [], value: v } : { names: [], value: v };
                                };
                            }

                            return function (raw) {
                                var args = [],
                                    names = [],
                                    keys = Object.getOwnPropertyNames(raw);

                                for (var i = 0; i < params.length; i++) {
                                    var prm = params[i],
                                        name = prm.sn || prm.n,
                                        foundName = null;

                                    for (var j = 0; j < keys.length; j++) {
                                        if (name === keys[j]) {
                                            foundName = keys[j];
                                            break;
                                        }
                                    }

                                    if (!foundName) {
                                        name = name.toLowerCase();
                                        for (var j = 0; j < keys.length; j++) {
                                            if (name === keys[j].toLowerCase()) {
                                                foundName = keys[j];
                                                break;
                                            }
                                        }
                                    }

                                    name = foundName;

                                    if (name) {
                                        args[i] = Newtonsoft.Json.JsonConvert.DeserializeObject(raw[name], prm.pt, settings, true);
                                        names.push(name);
                                    } else {
                                        args[i] = H5.getDefaultValue(prm.pt);
                                    }
                                }

                                return { names: names, value: H5.Reflection.invokeCI(jsonCtor, args) };
                            };
                        }
                    }

                    var fn = function () {
                        return { names: [], value: H5.createInstance(type), default: true };
                    };

                    fn.default = true;

                    return fn;
                },

                createInstance: function (type, raw, settings) {
                    var builder = this.getInstanceBuilder(type, raw, settings);
                    return builder(raw);
                },

                needReuse: function (objectCreationHandling, value, type, isDefCtor) {
                    if (objectCreationHandling === Newtonsoft.Json.ObjectCreationHandling.Reuse || (objectCreationHandling === Newtonsoft.Json.ObjectCreationHandling.Auto && value != null)) {
                        if (isDefCtor && 
                            type.$kind !== "struct" &&
                            type.$kind !== "enum" &&
                            type !== System.String && 
                            type !== System.Boolean &&
                            type !== System.Int64 &&
                            type !== System.UInt64 &&
                            type !== System.Int32 &&
                            type !== System.UInt32 &&
                            type !== System.Int16 &&
                            type !== System.UInt16 &&
                            type !== System.Byte &&
                            type !== System.SByte &&
                            type !== System.Single &&
                            type !== System.Double &&
                            type !== System.Decimal                            
                            ) {
                            return true;
                        }
                    }

                    return false;
                },

                tryToGetCastOperator: function (raw, type) {
                    // Implicit/explicit operators are not supported for null inputs values because we don't know what the source type is (this is consistent with the Newtonsoft implementation).
                    // They are also only supported for particular primitive values - again, consistent with Newtonsoft and due to limited source type information. Newtonsoft parses numbers as
                    // either Int64 or Double, depending upon whether the input string includes a ".", but we don't have that information here (a number is always parsed into the type "number")
                    // and so we'll look for either a Double or Int64 operator if the raw value is a number.
                    if (raw === null) {
                        return null;
                    }
                    var typesToLookFor;
                    if ((typeof raw === "boolean") || (typeof raw === "string")) {
                        typesToLookFor = [ H5.getType(raw) ];
                    }
                    else if (typeof raw === "number") {
                        typesToLookFor = [ System.Double, System.Int64 ];
                    }
                    else {
                        return null;
                    }
                    for (var i = 0; i < typesToLookFor.length; i++) {
                        var typeToLookFor = typesToLookFor[i];
                        var explicitCastOnTarget = H5.Reflection.getMembers(type, 8, 284, "op_Explicit", [typeToLookFor]);
                        if (explicitCastOnTarget) {
                            return function (value) { return H5.Reflection.midel(explicitCastOnTarget, null)(value); };
                        }
                        var implicitCastOnTarget = H5.Reflection.getMembers(type, 8, 284, "op_Implicit", [typeToLookFor]);
                        if (implicitCastOnTarget) {
                            return function (value) { return H5.Reflection.midel(implicitCastOnTarget, null)(value); };
                        }
                    }
                    return null;
                },

                DeserializeObject: function (raw, type, settings, field, instance, i_names) {
                    settings = settings || {};
                    if (type.$kind === "interface") {
                        if (System.Collections.IDictionary === type) {
                            type = System.Collections.Generic.Dictionary$2(System.Object, System.Object);
                        } else if (H5.Reflection.isGenericType(type) && H5.Reflection.isAssignableFrom(System.Collections.Generic.IDictionary$2, H5.Reflection.getGenericTypeDefinition(type))) {
                            var tPrms = System.Collections.Generic.Dictionary$2.getTypeParameters(type);
                            type = System.Collections.Generic.Dictionary$2(tPrms[0] || System.Object, tPrms[1] || System.Object);
                        } else if (type === System.Collections.IList || type === System.Collections.ICollection) {
                            type = System.Collections.Generic.List$1(System.Object);
                        } else if (H5.Reflection.isGenericType(type) && (
                            H5.Reflection.isAssignableFrom(System.Collections.Generic.IList$1, H5.Reflection.getGenericTypeDefinition(type)) ||
                            H5.Reflection.isAssignableFrom(System.Collections.Generic.ICollection$1, H5.Reflection.getGenericTypeDefinition(type))
                        )) {
                            type = System.Collections.Generic.List$1(System.Collections.Generic.List$1.getElementType(type) || System.Object);
                        }
                    }

                    if (!field && typeof raw === "string") {
                        var obj = Newtonsoft.Json.JsonConvert.parse(raw);

                        if (typeof obj === "object" || H5.isArray(obj) || type === System.Array.type(System.Byte, 1) || type === Function || type == System.Type || type === System.Guid || type === System.Globalization.CultureInfo || type === System.Uri || type === System.DateTime || type === System.DateTimeOffset || type === System.Char || H5.Reflection.isEnum(type)) {
                            raw = obj;
                        }
                    }

                    var isObject = type === Object || type === System.Object,
                        fromObject = H5.isObject(raw);


                    if (isObject && fromObject && raw && raw.$type) {
                        var realType = Newtonsoft.Json.JsonConvert.BindToType(settings, raw.$type, type);

                        type = realType;
                        isObject = false;
                    }

                    if (isObject && fromObject || type.$literal && !H5.getMetadata(type)) {
                        return H5.merge(isObject ? {} : (instance || H5.createInstance(type)), raw);
                    }

                    var def = H5.getDefaultValue(type);

                    if (type.$nullable) {
                        type = type.$nullableType;
                    }

                    if (raw === null) {
                        return def;
                    } else if (raw === false) {
                        if (type === System.Boolean) {
                            return false;
                        }

                        if (type === System.String) {
                            return "false";
                        }

                        var castOperator = Newtonsoft.Json.JsonConvert.tryToGetCastOperator(raw, type);
                        if (castOperator) {
                            return castOperator(raw);
                        }

                        if (isObject) {
                            return H5.box(raw, System.Boolean, System.Boolean.toString);
                        }

                        return def;
                    } else if (raw === true) {
                        if (type === System.Boolean) {
                            return true;
                        } else if (type === System.Int64) {
                            return System.Int64(1);
                        } else if (type === System.UInt64) {
                            return System.UInt64(1);
                        } else if (type === System.Decimal) {
                            return System.Decimal(1.0);
                        } else if (type === String.String) {
                            return "true";
                        } else if (type === System.DateTime) {
                            return System.DateTime.create$2(1, 0);
                        } else if (type === System.DateTimeOffset) {
                            return System.DateTimeOffset.MinValue.$clone();
                        } else if (H5.Reflection.isEnum(type)) {
                            return H5.unbox(System.Enum.parse(type, 1));
                        } else {
                            if (typeof def === "number") {
                                return def + 1;
                            }

                            var castOperator = Newtonsoft.Json.JsonConvert.tryToGetCastOperator(raw, type);
                            if (castOperator) {
                                return castOperator(raw);
                            }

                            if (isObject) {
                                return H5.box(raw, System.Boolean, System.Boolean.toString);
                            }

                            throw new System.ArgumentException(System.String.format("Could not cast or convert from {0} to {1}", H5.getTypeName(raw), H5.getTypeName(type)));
                        }
                    } else if (typeof raw === "number") {
                        if (type.$number && !type.$is(raw)) {
                            if ((type !== System.Decimal || !type.tryParse(raw, null, {})) &&
                                (!System.Int64.is64BitType(type) || !type.tryParse(raw.toString(), {}))) {
                                throw new Newtonsoft.Json.JsonException(System.String.format("Input string '{0}' is not a valid {1}", raw, H5.getTypeName(type)));
                            }
                        }

                        if (type === System.Boolean) {
                            return raw !== 0;
                        } else if (H5.Reflection.isEnum(type)) {
                            return H5.unbox(System.Enum.parse(type, raw));
                        } else if (type === System.SByte) {
                            return raw | 0;
                        } else if (type === System.Byte) {
                            return raw >>> 0;
                        } else if (type === System.Int16) {
                            return raw | 0;
                        } else if (type === System.UInt16) {
                            return raw >>> 0;
                        } else if (type === System.Int32) {
                            return raw | 0;
                        } else if (type === System.UInt32) {
                            return raw >>> 0;
                        } else if (type === System.Int64) {
                            return System.Int64(raw);
                        } else if (type === System.UInt64) {
                            return System.UInt64(raw);
                        } else if (type === System.Single) {
                            return raw;
                        } else if (type === System.Double) {
                            return raw;
                        } else if (type === System.Decimal) {
                            return System.Decimal(raw);
                        } else if (type === System.Char) {
                            return raw | 0;
                        } else if (type === System.String) {
                            return raw.toString();
                        } else if (type === System.DateTime) {
                            return System.DateTime.create$2(raw | 0, 0);
                        } else if (type === System.TimeSpan) {
                            return System.TimeSpan.fromTicks(raw);
                        } else if (type === System.DateTimeOffset) {
                            return new System.DateTimeOffset.$ctor5(System.Int64(raw | 0), new System.DateTimeOffset.ctor().Offset);
                        } else {
                            var castOperator = Newtonsoft.Json.JsonConvert.tryToGetCastOperator(raw, type);
                            if (castOperator) {
                                return castOperator(raw);
                            }
                            if (isObject) {
                                return H5.box(raw, H5.getType(raw));
                            }
                            throw new System.ArgumentException(System.String.format("Could not cast or convert from {0} to {1}", H5.getTypeName(raw), H5.getTypeName(type)));
                        }
                    } else if (typeof raw === "string") {
                        var isDecimal = type === System.Decimal,
                            isSpecial = isDecimal || System.Int64.is64BitType(type);
                        if (isSpecial && (isDecimal ? !type.tryParse(raw, null, {}) : !type.tryParse(raw, {}))) {
                            throw new Newtonsoft.Json.JsonException(System.String.format("Input string '{0}' is not a valid {1}", raw, H5.getTypeName(type)));
                        }

                        var isFloat = type == System.Double || type == System.Single;
                        if (!isSpecial && type.$number && (isFloat ? !type.tryParse(raw, null, {}) : !type.tryParse(raw, {}))) {
                            throw new Newtonsoft.Json.JsonException(System.String.format("Could not convert {0} to {1}: {2}", H5.getTypeName(raw), H5.getTypeName(type), raw));
                        }

                        if (type === Function || type == System.Type) {
                            return H5.Reflection.getType(raw);
                        } else if (type === System.Globalization.CultureInfo) {
                            return new System.Globalization.CultureInfo(raw);
                        } else if (type === System.Uri) {
                            return new System.Uri(raw);
                        } else if (type === System.Guid) {
                            return System.Guid.Parse(raw);
                        } else if (type === System.Boolean) {
                            var parsed = { v: false };
                            if (!System.String.isNullOrWhiteSpace(raw) && System.Boolean.tryParse(raw, parsed)) {
                                return parsed.v;
                            }
                            return false;
                        } else if (type === System.SByte) {
                            return raw | 0;
                        } else if (type === System.Byte) {
                            return raw >>> 0;
                        } else if (type === System.Int16) {
                            return raw | 0;
                        } else if (type === System.UInt16) {
                            return raw >>> 0;
                        } else if (type === System.Int32) {
                            return raw | 0;
                        } else if (type === System.UInt32) {
                            return raw >>> 0;
                        } else if (type === System.Int64) {
                            return System.Int64(raw);
                        } else if (type === System.UInt64) {
                            return System.UInt64(raw);
                        } else if (type === System.Single) {
                            return parseFloat(raw);
                        } else if (type === System.Double) {
                            return parseFloat(raw);
                        } else if (type === System.Decimal) {
                            try {
                                return System.Decimal(raw);
                            } catch (ex) {
                                return System.Decimal(0);
                            }
                        } else if (type === System.Char) {
                            if (raw.length === 0) {
                                return 0;
                            }

                            return raw.charCodeAt(0);
                        } else if (type === System.String) {
                            return field ? raw : JSON.parse(raw);
                        } else if (type === System.TimeSpan) {
                            return System.TimeSpan.parse(raw[0] == '"' ? JSON.parse(raw) : raw);
                        } else if (type === System.DateTime) {
                            var isUtc = System.String.endsWith(raw, "Z");
                            var format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFF" + (isUtc ? "'Z'" : "K");

                            var d = System.DateTime.parseExact(raw, format, null, true, true);

                            d = d != null ? d : System.DateTime.parse(raw, undefined, true);

                            if (isUtc && d.kind !== 1) {
                                d = System.DateTime.specifyKind(d, 1);
                            }

                            return d;
                        } else if (type === System.DateTimeOffset) {
                            var isUtc = System.String.endsWith(raw, "Z");
                            var format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss.FFFFFFF" + (isUtc ? "'Z'" : "K");

                            var d = System.DateTime.parseExact(raw, format, null, true, true);

                            d = d != null ? d : System.DateTime.parse(raw, undefined, true);

                            if (isUtc && d.kind !== 1) {
                                d = System.DateTime.specifyKind(d, 1);
                            }

                            return new System.DateTimeOffset.$ctor1(d);
                        } else if (H5.Reflection.isEnum(type)) {
                            return H5.unbox(System.Enum.parse(type, raw));
                        } else if (type === System.Array.type(System.Byte, 1)) {
                            return System.Convert.fromBase64String(raw);
                        } else {
                            var castOperator = Newtonsoft.Json.JsonConvert.tryToGetCastOperator(raw, type);
                            if (castOperator) {
                                return castOperator(raw);
                            }

                            if (isObject) {
                                return raw;
                            }

                            throw new System.ArgumentException(System.String.format("Could not cast or convert from {0} to {1}", H5.getTypeName(raw), H5.getTypeName(type)));
                        }
                    } else if (typeof raw === "object") {
                        if (def !== null && type.$kind !== "struct") {
                            return def;
                        } else if (H5.isArray(null, type)) {
                            var typeName = raw["$type"];

                            if (typeName != null) {
                                type = Newtonsoft.Json.JsonConvert.BindToType(settings, typeName, type);
                                raw = raw["$values"];
                            }

                            if (raw.length === undefined) {
                                return [];
                            }

                            var arr = new Array();
                            System.Array.type(type.$elementType, type.$rank || 1, arr);

                            for (var i = 0; i < raw.length; i++) {
                                arr[i] = Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], type.$elementType, settings, true);
                            }

                            return arr;
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IList, type)) {
                            var typeName = raw["$type"];

                            if (typeName != null) {
                                type = Newtonsoft.Json.JsonConvert.BindToType(settings, typeName, type);
                                raw = raw["$values"];
                            }

                            var typeElement = System.Collections.Generic.List$1.getElementType(type) || System.Object;
                            var list = instance ? {value: instance} : Newtonsoft.Json.JsonConvert.createInstance(type, raw, settings);

                            if (list && list.$list) {
                                return list.value;
                            }

                            list = list.value;

                            if (raw.length === undefined) {
                                return list;
                            }

                            for (var i = 0; i < raw.length; i++) {
                                list.add(Newtonsoft.Json.JsonConvert.DeserializeObject(raw[i], typeElement, settings, true));
                            }

                            return list;
                        } else if (H5.Reflection.isAssignableFrom(System.Collections.IDictionary, type)) {
                            var typesGeneric = System.Collections.Generic.Dictionary$2.getTypeParameters(type),
                                typeKey = typesGeneric[0] || System.Object,
                                typeValue = typesGeneric[1] || System.Object,
                                names;

                            var typeName = raw["$type"],
                                handling = false;

                            if (typeName != null) {
                                type = Newtonsoft.Json.JsonConvert.BindToType(settings, typeName, type);
                                handling = true;
                            }

                            var dictionary = instance ? { value: instance } : Newtonsoft.Json.JsonConvert.createInstance(type, raw, settings);

                            if (dictionary && dictionary.$list) {
                                return dictionary.value;
                            }

                            names = dictionary.names || [];
                            dictionary = dictionary.value;

                            for (var each in raw) {
                                if (raw.hasOwnProperty(each) && (!handling || each !== "$type")) {
                                    if (names.indexOf(each) < 0) {
                                        dictionary.add(Newtonsoft.Json.JsonConvert.DeserializeObject(each, typeKey, settings, true), Newtonsoft.Json.JsonConvert.DeserializeObject(raw[each], typeValue, settings, true));
                                    }
                                }
                            }

                            return dictionary;
                        } else {
                            var typeName = raw["$type"];

                            if (typeName != null) {
                                type = Newtonsoft.Json.JsonConvert.BindToType(settings, typeName, type);
                            }

                            if (!H5.getMetadata(type)) {
                                return H5.merge(isObject ? {} : (instance || H5.createInstance(type)), raw);
                            }

                            var o = instance ? { value: instance, names: i_names, default: true } : Newtonsoft.Json.JsonConvert.createInstance(type, raw, settings),
                                isDefCtor,
                                names;

                            names = o.names || [];
                            isDefCtor = o.default;
                            o = o.value;

                            var methods = H5.Reflection.getMembers(type, 8, 54);

                            if (methods.length > 0) {
                                for (var midx = 0; midx < methods.length; midx++) {
                                    if (System.Attribute.isDefined(methods[midx], System.Runtime.Serialization.OnDeserializingAttribute, false)) {
                                        H5.Reflection.midel(methods[midx], o)(null);
                                    }
                                }
                            }

                            var camelCase = settings && H5.is(settings.ContractResolver, Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver),
                                fields = Newtonsoft.Json.JsonConvert.getMembers(type, 4),
                                value,
                                cfg,
                                f,
                                p,
                                mname,
                                finst,
                                i;

                            for (i = 0; i < fields.length; i++) {
                                cfg = fields[i];
                                f = cfg.member;

                                mname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (f.n.charAt(0).toLowerCase() + f.n.substr(1)) : f.n);

                                if (names.indexOf(mname) > -1) {
                                    continue;
                                }

                                value = raw[mname];

                                if (value === undefined) {
                                    value = Newtonsoft.Json.JsonConvert.getValue(raw, mname);
                                }                                                              

                                var result = Newtonsoft.Json.JsonConvert.preRawProcess(cfg, raw, value, settings);
                                value = result.value;

                                if (value !== undefined) {
                                    var currentValue = H5.Reflection.fieldAccess(f, o),
                                        objectCreationHandling = Newtonsoft.Json.ObjectCreationHandling.Auto;

                                    finst = undefined;

                                    if (cfg.attr && cfg.attr._objectCreationHandling != null) {
                                        objectCreationHandling = cfg.attr._objectCreationHandling;
                                    }
                                    else if (settings._objectCreationHandling != null) {
                                        objectCreationHandling = settings._objectCreationHandling;
                                    }

                                    if (Newtonsoft.Json.JsonConvert.needReuse(objectCreationHandling, currentValue, f.rt, isDefCtor)) {
                                        finst = H5.unbox(currentValue, true);
                                    }

                                    var typeNameHandling,
                                        oldTypeNameHandling;

                                    if (cfg.attr) {
                                        typeNameHandling = cfg.attr._typeNameHandling;
                                    }

                                    if (typeNameHandling != null) {
                                        oldTypeNameHandling = settings._typeNameHandling;
                                        settings._typeNameHandling = typeNameHandling;
                                    }

                                    var svalue = Newtonsoft.Json.JsonConvert.DeserializeObject(value, f.rt, settings, true, finst);

                                    if (typeNameHandling != null) {
                                        settings._typeNameHandling = oldTypeNameHandling;
                                    }

                                    result = Newtonsoft.Json.JsonConvert.preProcess(cfg, o, svalue, settings);

                                    if (result !== false && finst === undefined) {
                                        H5.Reflection.fieldAccess(f, o, result.value);
                                    }                                    
                                }
                            }

                            var properties = Newtonsoft.Json.JsonConvert.getMembers(type, 16);

                            for (i = 0; i < properties.length; i++) {
                                cfg = properties[i];
                                p = cfg.member;

                                mname = cfg.attr && cfg.attr.PropertyName || (camelCase ? (p.n.charAt(0).toLowerCase() + p.n.substr(1)) : p.n);

                                if (names.indexOf(mname) > -1) {
                                    continue;
                                }

                                value = raw[mname];

                                if (value === undefined) {
                                    value = Newtonsoft.Json.JsonConvert.getValue(raw, mname);
                                }

                                var result = Newtonsoft.Json.JsonConvert.preRawProcess(cfg, raw, value, settings);
                                value = result.value;

                                if (value !== undefined) {
                                    finst = undefined;

                                    if (p.g) {                                        
                                        var currentValue = H5.Reflection.midel(p.g, o)(),
                                            objectCreationHandling = Newtonsoft.Json.ObjectCreationHandling.Auto;

                                        if (cfg.attr && cfg.attr._objectCreationHandling != null) {
                                            objectCreationHandling = cfg.attr._objectCreationHandling;
                                        }
                                        else if (settings._objectCreationHandling != null) {
                                            objectCreationHandling = settings._objectCreationHandling;
                                        }

                                        if (Newtonsoft.Json.JsonConvert.needReuse(objectCreationHandling, currentValue, p.rt, isDefCtor)) {
                                            finst = H5.unbox(currentValue, true);
                                        }
                                    }

                                    var typeNameHandling,
                                        oldTypeNameHandling;

                                    if (cfg.attr) {
                                        typeNameHandling = cfg.attr._typeNameHandling;
                                    }

                                    if (typeNameHandling != null) {
                                        oldTypeNameHandling = settings._typeNameHandling;
                                        settings._typeNameHandling = typeNameHandling;
                                    }

                                    var svalue = Newtonsoft.Json.JsonConvert.DeserializeObject(value, p.rt, settings, true, finst);

                                    if (typeNameHandling != null) {
                                        settings._typeNameHandling = oldTypeNameHandling;
                                    }

                                    result = Newtonsoft.Json.JsonConvert.preProcess(cfg, o, svalue, settings);

                                    if (result !== false && finst === undefined) {
                                        if (!!p.s) {
                                            H5.Reflection.midel(p.s, o)(result.value);
                                        }
                                        else if (type.$kind === "anonymous") {
                                            o[p.n] = result.value;
                                        }
                                    }
                                }
                            }

                            if (methods.length > 0) {
                                for (var midx = 0; midx < methods.length; midx++) {
                                    if (System.Attribute.isDefined(methods[midx], System.Runtime.Serialization.OnDeserializedAttribute, false)) {
                                        H5.Reflection.midel(methods[midx], o)(null);
                                    }
                                }
                            }

                            return o;
                        }
                    }
                }
            }
        }
    });
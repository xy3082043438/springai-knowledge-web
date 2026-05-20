/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRoles, createRole, updateRole, deleteRole } from '@/api/system/role';
import { permissionGroups } from '@/utils/rbac';
import { formatDateTime } from '@/utils/date';
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref();
const roles = ref([]);
const editingSystemRole = ref(false);
const roleForm = reactive({
    id: null,
    name: '',
    permissions: [],
});
const formRules = reactive({
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { max: 64, message: '角色名称最多 64 个字符', trigger: 'blur' },
    ],
});
/* ---------- permission helpers ---------- */
const permMeta = new Map();
permissionGroups.forEach((g) => {
    g.permissions.forEach((p) => {
        permMeta.set(p.code, { label: p.label, groupAccent: g.accent });
    });
});
const getPermLabel = (code) => permMeta.get(code)?.label || code;
const getPermGroupColor = (code) => permMeta.get(code)?.groupAccent || '#909399';
const isGroupAllChecked = (group) => group.permissions.every((p) => roleForm.permissions.includes(p.code));
const isGroupIndeterminate = (group) => {
    const checked = group.permissions.filter((p) => roleForm.permissions.includes(p.code)).length;
    return checked > 0 && checked < group.permissions.length;
};
const toggleGroup = (group, checked) => {
    const codes = group.permissions.map((p) => p.code);
    if (checked) {
        const set = new Set(roleForm.permissions);
        codes.forEach((c) => set.add(c));
        roleForm.permissions = [...set];
    }
    else {
        roleForm.permissions = roleForm.permissions.filter((p) => !codes.includes(p));
    }
};
const togglePerm = (code, checked) => {
    if (checked) {
        if (!roleForm.permissions.includes(code)) {
            roleForm.permissions.push(code);
        }
    }
    else {
        roleForm.permissions = roleForm.permissions.filter((p) => p !== code);
    }
};
/* ---------- data ---------- */
const loadData = async () => {
    loading.value = true;
    try {
        const { data } = await listRoles();
        roles.value = data;
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadData);
/* ---------- CRUD ---------- */
const handleAdd = () => {
    dialogType.value = 'add';
    roleForm.id = null;
    roleForm.name = '';
    roleForm.permissions = [];
    editingSystemRole.value = false;
    dialogVisible.value = true;
};
const handleEdit = (row) => {
    dialogType.value = 'edit';
    roleForm.id = row.id;
    roleForm.name = row.name;
    roleForm.permissions = [...(row.permissions || [])];
    editingSystemRole.value = row.systemRole;
    dialogVisible.value = true;
};
const handleDelete = (row) => {
    if (row.systemRole) {
        ElMessage.warning('抱歉，系统内置角色受到保护，无法进行删除操作。');
        return;
    }
    const warnings = [];
    if (row.userCount > 0)
        warnings.push(`${row.userCount} 个用户`);
    if (row.documentCount > 0)
        warnings.push(`${row.documentCount} 篇文档`);
    const extra = warnings.length > 0
        ? `\n该角色仍关联 ${warnings.join('、')}，删除后相关关联将被清除。`
        : '';
    ElMessageBox.confirm(`您确定要彻底删除角色「${row.name}」吗？操作不可逆。${extra}`, '请确认删除', { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' })
        .then(async () => {
        await deleteRole(row.id);
        ElMessage.success('删除操作已成功完成。');
        loadData();
    })
        .catch(() => { });
};
const resetForm = () => {
    formRef.value?.resetFields();
    roleForm.id = null;
    roleForm.name = '';
    roleForm.permissions = [];
    editingSystemRole.value = false;
};
const saveRole = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            if (dialogType.value === 'add') {
                await createRole({
                    name: roleForm.name,
                    permissions: roleForm.permissions,
                });
            }
            else {
                if (roleForm.id === null)
                    return;
                const payload = { permissions: roleForm.permissions };
                if (!editingSystemRole.value) {
                    payload.name = roleForm.name;
                }
                await updateRole(roleForm.id, payload);
            }
            ElMessage.success('提交成功！您的修改已保存。');
            dialogVisible.value = false;
            loadData();
        }
        finally {
            saving.value = false;
        }
    });
};
// Local redundant function removed.
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['perm-group-card']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-compact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-compact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['role-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-grid']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "role-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-title" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-actions" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    icon: "Refresh",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    icon: "Refresh",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.loadData)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Plus",
}));
const __VLS_10 = __VLS_9({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_12;
let __VLS_13;
let __VLS_14;
const __VLS_15 = {
    onClick: (__VLS_ctx.handleAdd)
};
__VLS_11.slots.default;
var __VLS_11;
const __VLS_16 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    data: (__VLS_ctx.roles),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_18 = __VLS_17({
    data: (__VLS_ctx.roles),
    ...{ style: {} },
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_19.slots.default;
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "name",
    label: "角色名称",
    width: "160",
}));
const __VLS_22 = __VLS_21({
    prop: "name",
    label: "角色名称",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_23.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-name-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.name);
    if (row.systemRole) {
        const __VLS_24 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            type: "warning",
            size: "small",
            effect: "plain",
        }));
        const __VLS_26 = __VLS_25({
            type: "warning",
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        __VLS_27.slots.default;
        var __VLS_27;
    }
}
var __VLS_23;
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    label: "权限",
    minWidth: "300",
}));
const __VLS_30 = __VLS_29({
    label: "权限",
    minWidth: "300",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-tags" },
    });
    for (const [p] of __VLS_getVForSourceType((row.permissions))) {
        const __VLS_32 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            key: (p),
            size: "small",
            color: (__VLS_ctx.getPermGroupColor(p)),
            ...{ style: {} },
        }));
        const __VLS_34 = __VLS_33({
            key: (p),
            size: "small",
            color: (__VLS_ctx.getPermGroupColor(p)),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        (__VLS_ctx.getPermLabel(p));
        var __VLS_35;
    }
    if (!row.permissions?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no-perm" },
        });
    }
}
var __VLS_31;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "userCount",
    label: "关联用户",
    width: "100",
    align: "center",
}));
const __VLS_38 = __VLS_37({
    prop: "userCount",
    label: "关联用户",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "documentCount",
    label: "关联文档",
    width: "100",
    align: "center",
}));
const __VLS_42 = __VLS_41({
    prop: "documentCount",
    label: "关联文档",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_46 = __VLS_45({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDateTime(row.createdAt));
}
var __VLS_47;
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    label: "操作",
    width: "160",
    fixed: "right",
}));
const __VLS_50 = __VLS_49({
    label: "操作",
    width: "160",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_52 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_56;
    let __VLS_57;
    let __VLS_58;
    const __VLS_59 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_55.slots.default;
    var __VLS_55;
    const __VLS_60 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
        disabled: (row.systemRole),
    }));
    const __VLS_62 = __VLS_61({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
        disabled: (row.systemRole),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    let __VLS_64;
    let __VLS_65;
    let __VLS_66;
    const __VLS_67 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_63.slots.default;
    var __VLS_63;
}
var __VLS_51;
var __VLS_19;
const __VLS_68 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '新增角色' : '编辑角色'),
    width: "680px",
    alignCenter: true,
}));
const __VLS_70 = __VLS_69({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '新增角色' : '编辑角色'),
    width: "680px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
let __VLS_72;
let __VLS_73;
let __VLS_74;
const __VLS_75 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_71.slots.default;
const __VLS_76 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
    model: (__VLS_ctx.roleForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "90px",
    labelPosition: "left",
}));
const __VLS_78 = __VLS_77({
    model: (__VLS_ctx.roleForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "90px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_80 = {};
__VLS_79.slots.default;
const __VLS_82 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    label: "角色名称",
    prop: "name",
}));
const __VLS_84 = __VLS_83({
    label: "角色名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.roleForm.name),
    placeholder: "请输入角色名称（例如：普通用户）...",
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.editingSystemRole),
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.roleForm.name),
    placeholder: "请输入角色名称（例如：普通用户）...",
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.editingSystemRole),
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
if (__VLS_ctx.editingSystemRole) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "field-hint" },
    });
}
var __VLS_85;
const __VLS_90 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    label: "权限分配",
}));
const __VLS_92 = __VLS_91({
    label: "权限分配",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
__VLS_93.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "perm-grid" },
});
for (const [group] of __VLS_getVForSourceType((__VLS_ctx.permissionGroups))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (group.key),
        ...{ class: "perm-group-card" },
        ...{ style: ({ '--group-accent': group.accent }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-group-head" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-group-title" },
    });
    const __VLS_94 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        ...{ class: "group-icon" },
        ...{ style: ({ color: group.accent }) },
    }));
    const __VLS_96 = __VLS_95({
        ...{ class: "group-icon" },
        ...{ style: ({ color: group.accent }) },
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = ((group.icon));
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({}));
    const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
    var __VLS_97;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "perm-group-label" },
    });
    (group.label);
    const __VLS_102 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isGroupAllChecked(group)),
        indeterminate: (__VLS_ctx.isGroupIndeterminate(group)),
        ...{ class: "perm-group-check-all" },
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isGroupAllChecked(group)),
        indeterminate: (__VLS_ctx.isGroupIndeterminate(group)),
        ...{ class: "perm-group-check-all" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_106;
    let __VLS_107;
    let __VLS_108;
    const __VLS_109 = {
        onChange: ((val) => __VLS_ctx.toggleGroup(group, val))
    };
    __VLS_105.slots.default;
    var __VLS_105;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-group-body" },
    });
    for (const [perm] of __VLS_getVForSourceType((group.permissions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ onClick: (...[$event]) => {
                    __VLS_ctx.togglePerm(perm.code, !__VLS_ctx.roleForm.permissions.includes(perm.code));
                } },
            key: (perm.code),
            ...{ class: "perm-compact-item" },
            ...{ class: ({ active: __VLS_ctx.roleForm.permissions.includes(perm.code) }) },
        });
        const __VLS_110 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
            ...{ 'onClick': {} },
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.roleForm.permissions.includes(perm.code)),
        }));
        const __VLS_112 = __VLS_111({
            ...{ 'onClick': {} },
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.roleForm.permissions.includes(perm.code)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_111));
        let __VLS_114;
        let __VLS_115;
        let __VLS_116;
        const __VLS_117 = {
            onClick: () => { }
        };
        const __VLS_118 = {
            onChange: ((val) => __VLS_ctx.togglePerm(perm.code, val))
        };
        var __VLS_113;
        const __VLS_119 = {}.ElTooltip;
        /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent(__VLS_119, new __VLS_119({
            content: (perm.description),
            placement: "top",
            showAfter: (500),
        }));
        const __VLS_121 = __VLS_120({
            content: (perm.description),
            placement: "top",
            showAfter: (500),
        }, ...__VLS_functionalComponentArgsRest(__VLS_120));
        __VLS_122.slots.default;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "perm-item-label" },
        });
        (perm.label);
        var __VLS_122;
    }
}
var __VLS_93;
var __VLS_79;
{
    const { footer: __VLS_thisSlot } = __VLS_71.slots;
    const __VLS_123 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent(__VLS_123, new __VLS_123({
        ...{ 'onClick': {} },
    }));
    const __VLS_125 = __VLS_124({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_127;
    let __VLS_128;
    let __VLS_129;
    const __VLS_130 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_126.slots.default;
    var __VLS_126;
    const __VLS_131 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_132 = __VLS_asFunctionalComponent(__VLS_131, new __VLS_131({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_133 = __VLS_132({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_132));
    let __VLS_135;
    let __VLS_136;
    let __VLS_137;
    const __VLS_138 = {
        onClick: (__VLS_ctx.saveRole)
    };
    __VLS_134.slots.default;
    var __VLS_134;
}
var __VLS_71;
/** @type {__VLS_StyleScopedClasses['role-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['page-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['role-name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-tags']} */ ;
/** @type {__VLS_StyleScopedClasses['no-perm']} */ ;
/** @type {__VLS_StyleScopedClasses['field-hint']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-card']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-head']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-title']} */ ;
/** @type {__VLS_StyleScopedClasses['group-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-label']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-check-all']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-body']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-compact-item']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item-label']} */ ;
// @ts-ignore
var __VLS_81 = __VLS_80;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            permissionGroups: permissionGroups,
            formatDateTime: formatDateTime,
            loading: loading,
            saving: saving,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            roles: roles,
            editingSystemRole: editingSystemRole,
            roleForm: roleForm,
            formRules: formRules,
            getPermLabel: getPermLabel,
            getPermGroupColor: getPermGroupColor,
            isGroupAllChecked: isGroupAllChecked,
            isGroupIndeterminate: isGroupIndeterminate,
            toggleGroup: toggleGroup,
            togglePerm: togglePerm,
            loadData: loadData,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            resetForm: resetForm,
            saveRole: saveRole,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=index.vue.js.map
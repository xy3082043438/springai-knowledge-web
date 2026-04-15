/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRoles, createRole, updateRole, deleteRole } from '@/api/system/role';
import { permissionGroups } from '@/utils/rbac';
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
const formatDate = (dateStr) => {
    if (!dateStr)
        return '-';
    return new Date(dateStr).toLocaleString('zh-CN', { hour12: false });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['perm-group-card']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item']} */ ;
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
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "id",
    label: "ID",
    width: "70",
}));
const __VLS_22 = __VLS_21({
    prop: "id",
    label: "ID",
    width: "70",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "name",
    label: "角色名称",
    width: "160",
}));
const __VLS_26 = __VLS_25({
    prop: "name",
    label: "角色名称",
    width: "160",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_27.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "role-name-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    (row.name);
    if (row.systemRole) {
        const __VLS_28 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
            type: "warning",
            size: "small",
            effect: "plain",
        }));
        const __VLS_30 = __VLS_29({
            type: "warning",
            size: "small",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_29));
        __VLS_31.slots.default;
        var __VLS_31;
    }
}
var __VLS_27;
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "权限",
    minWidth: "300",
}));
const __VLS_34 = __VLS_33({
    label: "权限",
    minWidth: "300",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-tags" },
    });
    for (const [p] of __VLS_getVForSourceType((row.permissions))) {
        const __VLS_36 = {}.ElTag;
        /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
            key: (p),
            size: "small",
            color: (__VLS_ctx.getPermGroupColor(p)),
            ...{ style: {} },
        }));
        const __VLS_38 = __VLS_37({
            key: (p),
            size: "small",
            color: (__VLS_ctx.getPermGroupColor(p)),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        __VLS_39.slots.default;
        (__VLS_ctx.getPermLabel(p));
        var __VLS_39;
    }
    if (!row.permissions?.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "no-perm" },
        });
    }
}
var __VLS_35;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "userCount",
    label: "关联用户",
    width: "100",
    align: "center",
}));
const __VLS_42 = __VLS_41({
    prop: "userCount",
    label: "关联用户",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    prop: "documentCount",
    label: "关联文档",
    width: "100",
    align: "center",
}));
const __VLS_46 = __VLS_45({
    prop: "documentCount",
    label: "关联文档",
    width: "100",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const __VLS_48 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}));
const __VLS_50 = __VLS_49({
    prop: "createdAt",
    label: "创建时间",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_51.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_51;
const __VLS_52 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    label: "操作",
    width: "160",
    fixed: "right",
}));
const __VLS_54 = __VLS_53({
    label: "操作",
    width: "160",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_55.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_56 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_59.slots.default;
    var __VLS_59;
    const __VLS_64 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
        disabled: (row.systemRole),
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
        disabled: (row.systemRole),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_68;
    let __VLS_69;
    let __VLS_70;
    const __VLS_71 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_67.slots.default;
    var __VLS_67;
}
var __VLS_55;
var __VLS_19;
const __VLS_72 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '新增角色' : '编辑角色'),
    width: "680px",
    alignCenter: true,
}));
const __VLS_74 = __VLS_73({
    ...{ 'onClosed': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '新增角色' : '编辑角色'),
    width: "680px",
    alignCenter: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
let __VLS_76;
let __VLS_77;
let __VLS_78;
const __VLS_79 = {
    onClosed: (__VLS_ctx.resetForm)
};
__VLS_75.slots.default;
const __VLS_80 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    model: (__VLS_ctx.roleForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "90px",
    labelPosition: "left",
}));
const __VLS_82 = __VLS_81({
    model: (__VLS_ctx.roleForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "90px",
    labelPosition: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_84 = {};
__VLS_83.slots.default;
const __VLS_86 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    label: "角色名称",
    prop: "name",
}));
const __VLS_88 = __VLS_87({
    label: "角色名称",
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.roleForm.name),
    placeholder: "请输入角色名称（例如：普通用户）...",
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.editingSystemRole),
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.roleForm.name),
    placeholder: "请输入角色名称（例如：普通用户）...",
    maxlength: "64",
    showWordLimit: true,
    disabled: (__VLS_ctx.editingSystemRole),
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
if (__VLS_ctx.editingSystemRole) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "field-hint" },
    });
}
var __VLS_89;
const __VLS_94 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    label: "权限分配",
}));
const __VLS_96 = __VLS_95({
    label: "权限分配",
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
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
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "perm-group-dot" },
        ...{ style: ({ background: group.accent }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "perm-group-label" },
    });
    (group.label);
    const __VLS_98 = {}.ElCheckbox;
    /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isGroupAllChecked(group)),
        indeterminate: (__VLS_ctx.isGroupIndeterminate(group)),
        ...{ class: "perm-group-check-all" },
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.isGroupAllChecked(group)),
        indeterminate: (__VLS_ctx.isGroupIndeterminate(group)),
        ...{ class: "perm-group-check-all" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_102;
    let __VLS_103;
    let __VLS_104;
    const __VLS_105 = {
        onChange: ((val) => __VLS_ctx.toggleGroup(group, val))
    };
    __VLS_101.slots.default;
    var __VLS_101;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "perm-group-body" },
    });
    for (const [perm] of __VLS_getVForSourceType((group.permissions))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
            key: (perm.code),
            ...{ class: "perm-item" },
        });
        const __VLS_106 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent(__VLS_106, new __VLS_106({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.roleForm.permissions.includes(perm.code)),
        }));
        const __VLS_108 = __VLS_107({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.roleForm.permissions.includes(perm.code)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        let __VLS_110;
        let __VLS_111;
        let __VLS_112;
        const __VLS_113 = {
            onChange: ((val) => __VLS_ctx.togglePerm(perm.code, val))
        };
        var __VLS_109;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "perm-item-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "perm-item-label" },
        });
        (perm.label);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "perm-item-desc" },
        });
        (perm.description);
    }
}
var __VLS_97;
var __VLS_83;
{
    const { footer: __VLS_thisSlot } = __VLS_75.slots;
    const __VLS_114 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent(__VLS_114, new __VLS_114({
        ...{ 'onClick': {} },
    }));
    const __VLS_116 = __VLS_115({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    let __VLS_118;
    let __VLS_119;
    let __VLS_120;
    const __VLS_121 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_117.slots.default;
    var __VLS_117;
    const __VLS_122 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_126;
    let __VLS_127;
    let __VLS_128;
    const __VLS_129 = {
        onClick: (__VLS_ctx.saveRole)
    };
    __VLS_125.slots.default;
    var __VLS_125;
}
var __VLS_75;
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
/** @type {__VLS_StyleScopedClasses['perm-group-dot']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-label']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-check-all']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-group-body']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item-info']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item-label']} */ ;
/** @type {__VLS_StyleScopedClasses['perm-item-desc']} */ ;
// @ts-ignore
var __VLS_85 = __VLS_84;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            permissionGroups: permissionGroups,
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
            formatDate: formatDate,
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
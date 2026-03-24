/// <reference types="../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listUsers, createUser, updateUser } from '@/api/user';
import { listRoles } from '@/api/role';
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref();
const users = ref([]);
const roles = ref([]);
const userForm = reactive({
    id: null,
    username: '',
    role: '',
    password: ''
});
const formRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 64, message: '长度 3-64', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 100, message: '长度 6-100', trigger: 'blur' },
    ],
});
const loadData = async () => {
    loading.value = true;
    try {
        const [userRes, roleRes] = await Promise.all([listUsers(), listRoles()]);
        users.value = userRes.data;
        roles.value = roleRes.data;
    }
    finally {
        loading.value = false;
    }
};
onMounted(loadData);
const handleAdd = () => {
    dialogType.value = 'add';
    userForm.id = null;
    userForm.username = '';
    userForm.role = '';
    userForm.password = '';
    dialogVisible.value = true;
};
const handleEdit = (row) => {
    dialogType.value = 'edit';
    userForm.id = row.id;
    userForm.username = row.username;
    userForm.role = row.role || '';
    userForm.password = '';
    dialogVisible.value = true;
};
const formatDate = (dateStr) => {
    if (!dateStr)
        return '-';
    return new Date(dateStr).toLocaleString('zh-CN', { hour12: false });
};
const saveUser = async () => {
    if (!formRef.value)
        return;
    await formRef.value.validate(async (valid) => {
        if (!valid)
            return;
        saving.value = true;
        try {
            if (dialogType.value === 'add') {
                await createUser({
                    username: userForm.username,
                    password: userForm.password,
                    role: userForm.role || undefined,
                });
            }
            else {
                if (userForm.id === null)
                    return;
                await updateUser(userForm.id, {
                    username: userForm.username,
                    role: userForm.role || undefined,
                });
            }
            dialogVisible.value = false;
            ElMessage.success('保存成功');
            loadData();
        }
        finally {
            saving.value = false;
        }
    });
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "user-container" },
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
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Plus",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
    icon: "Plus",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (__VLS_ctx.handleAdd)
};
__VLS_3.slots.default;
var __VLS_3;
const __VLS_8 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    data: (__VLS_ctx.users),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_10 = __VLS_9({
    data: (__VLS_ctx.users),
    ...{ style: {} },
    stripe: true,
    border: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
__VLS_11.slots.default;
const __VLS_12 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    prop: "id",
    label: "ID",
    width: "80",
}));
const __VLS_14 = __VLS_13({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "username",
    label: "用户名",
    width: "180",
}));
const __VLS_18 = __VLS_17({
    prop: "username",
    label: "用户名",
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "role",
    label: "角色",
    width: "150",
}));
const __VLS_22 = __VLS_21({
    prop: "role",
    label: "角色",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_23.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_24 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
        type: (row.role?.toUpperCase() === 'ADMIN' ? 'danger' : 'info'),
        size: "small",
    }));
    const __VLS_26 = __VLS_25({
        type: (row.role?.toUpperCase() === 'ADMIN' ? 'danger' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    __VLS_27.slots.default;
    (row.role || '-');
    var __VLS_27;
}
var __VLS_23;
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "createdAt",
    label: "创建时间",
    width: "200",
}));
const __VLS_30 = __VLS_29({
    prop: "createdAt",
    label: "创建时间",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_31;
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    prop: "updatedAt",
    label: "更新时间",
    width: "200",
}));
const __VLS_34 = __VLS_33({
    prop: "updatedAt",
    label: "更新时间",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.updatedAt));
}
var __VLS_35;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    label: "操作",
    width: "150",
    fixed: "right",
}));
const __VLS_38 = __VLS_37({
    label: "操作",
    width: "150",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_40 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_44;
    let __VLS_45;
    let __VLS_46;
    const __VLS_47 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_43.slots.default;
    var __VLS_43;
}
var __VLS_39;
var __VLS_11;
const __VLS_48 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    width: "500px",
}));
const __VLS_50 = __VLS_49({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_51.slots.default;
const __VLS_52 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "80px",
}));
const __VLS_54 = __VLS_53({
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_56 = {};
__VLS_55.slots.default;
const __VLS_58 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    label: "用户名",
    prop: "username",
}));
const __VLS_60 = __VLS_59({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    modelValue: (__VLS_ctx.userForm.username),
}));
const __VLS_64 = __VLS_63({
    modelValue: (__VLS_ctx.userForm.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
var __VLS_61;
const __VLS_66 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    label: "角色",
}));
const __VLS_68 = __VLS_67({
    label: "角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
__VLS_69.slots.default;
const __VLS_70 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "选择角色",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_72 = __VLS_71({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "选择角色",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_74 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_76 = __VLS_75({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
}
var __VLS_73;
var __VLS_69;
if (__VLS_ctx.dialogType === 'add') {
    const __VLS_78 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
        label: "密码",
        prop: "password",
    }));
    const __VLS_80 = __VLS_79({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_81.slots.default;
    const __VLS_82 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_84 = __VLS_83({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    var __VLS_81;
}
var __VLS_55;
{
    const { footer: __VLS_thisSlot } = __VLS_51.slots;
    const __VLS_86 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
        ...{ 'onClick': {} },
    }));
    const __VLS_88 = __VLS_87({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    let __VLS_90;
    let __VLS_91;
    let __VLS_92;
    const __VLS_93 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_89.slots.default;
    var __VLS_89;
    const __VLS_94 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_98;
    let __VLS_99;
    let __VLS_100;
    const __VLS_101 = {
        onClick: (__VLS_ctx.saveUser)
    };
    __VLS_97.slots.default;
    var __VLS_97;
}
var __VLS_51;
/** @type {__VLS_StyleScopedClasses['user-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
// @ts-ignore
var __VLS_57 = __VLS_56;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            saving: saving,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            users: users,
            roles: roles,
            userForm: userForm,
            formRules: formRules,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            formatDate: formatDate,
            saveUser: saveUser,
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
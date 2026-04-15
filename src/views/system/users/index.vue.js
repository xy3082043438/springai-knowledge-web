/// <reference types="../../../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listUsers, createUser, updateUser, deleteUser } from '@/api/system/user';
import { listRoles } from '@/api/system/role';
const loading = ref(false);
const saving = ref(false);
const dialogVisible = ref(false);
const dialogType = ref('add');
const formRef = ref();
const router = useRouter();
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
            ElMessage.success('提交成功！您的修改已保存。');
            loadData();
        }
        finally {
            saving.value = false;
        }
    });
};
const handleDelete = (row) => {
    ElMessageBox.confirm(`您确定要彻底删除用户 "${row.username}" 吗？此操作无法撤销。`, '请确认删除', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        try {
            await deleteUser(row.id);
            ElMessage.success('删除操作已成功完成。');
            loadData();
        }
        catch (e) {
            // 错误由拦截器统一处理
        }
    }).catch(() => { });
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
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-actions" },
});
const __VLS_0 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    onClick: (...[$event]) => {
        __VLS_ctx.router.push('/roles');
    }
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
    data: (__VLS_ctx.users),
    ...{ style: {} },
    stripe: true,
    border: true,
}));
const __VLS_18 = __VLS_17({
    data: (__VLS_ctx.users),
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
    width: "80",
}));
const __VLS_22 = __VLS_21({
    prop: "id",
    label: "ID",
    width: "80",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "username",
    label: "用户名",
    minWidth: "180",
}));
const __VLS_26 = __VLS_25({
    prop: "username",
    label: "用户名",
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "role",
    label: "角色",
    minWidth: "150",
}));
const __VLS_30 = __VLS_29({
    prop: "role",
    label: "角色",
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
__VLS_31.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_31.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_32 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
        type: (row.role?.toUpperCase() === 'ADMIN' ? 'danger' : 'info'),
        size: "small",
    }));
    const __VLS_34 = __VLS_33({
        type: (row.role?.toUpperCase() === 'ADMIN' ? 'danger' : 'info'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    __VLS_35.slots.default;
    (row.role || '-');
    var __VLS_35;
}
var __VLS_31;
const __VLS_36 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    prop: "createdAt",
    label: "创建时间",
    width: "200",
}));
const __VLS_38 = __VLS_37({
    prop: "createdAt",
    label: "创建时间",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_39.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_39.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.createdAt));
}
var __VLS_39;
const __VLS_40 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
    prop: "updatedAt",
    label: "更新时间",
    width: "200",
}));
const __VLS_42 = __VLS_41({
    prop: "updatedAt",
    label: "更新时间",
    width: "200",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
__VLS_43.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_43.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    (__VLS_ctx.formatDate(row.updatedAt));
}
var __VLS_43;
const __VLS_44 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
    label: "操作",
    width: "150",
    align: "center",
}));
const __VLS_46 = __VLS_45({
    label: "操作",
    width: "150",
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
__VLS_47.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_47.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_48 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_52;
    let __VLS_53;
    let __VLS_54;
    const __VLS_55 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleEdit(row);
        }
    };
    __VLS_51.slots.default;
    var __VLS_51;
    const __VLS_56 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        link: true,
        type: "danger",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_60;
    let __VLS_61;
    let __VLS_62;
    const __VLS_63 = {
        onClick: (...[$event]) => {
            __VLS_ctx.handleDelete(row);
        }
    };
    __VLS_59.slots.default;
    var __VLS_59;
}
var __VLS_47;
var __VLS_19;
const __VLS_64 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    width: "500px",
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.dialogType === 'add' ? '添加用户' : '编辑用户'),
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
const __VLS_68 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "80px",
}));
const __VLS_70 = __VLS_69({
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.formRules),
    ref: "formRef",
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
/** @type {typeof __VLS_ctx.formRef} */ ;
var __VLS_72 = {};
__VLS_71.slots.default;
const __VLS_74 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "用户名",
    prop: "username",
}));
const __VLS_76 = __VLS_75({
    label: "用户名",
    prop: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.userForm.username),
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.userForm.username),
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
const __VLS_82 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    label: "角色",
}));
const __VLS_84 = __VLS_83({
    label: "角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "点击选择对应角色...",
    clearable: true,
    ...{ style: {} },
}));
const __VLS_88 = __VLS_87({
    modelValue: (__VLS_ctx.userForm.role),
    placeholder: "点击选择对应角色...",
    clearable: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
    const __VLS_90 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }));
    const __VLS_92 = __VLS_91({
        key: (role.name),
        label: (role.name),
        value: (role.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_91));
}
var __VLS_89;
var __VLS_85;
if (__VLS_ctx.dialogType === 'add') {
    const __VLS_94 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
        label: "密码",
        prop: "password",
    }));
    const __VLS_96 = __VLS_95({
        label: "密码",
        prop: "password",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    __VLS_97.slots.default;
    const __VLS_98 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_100 = __VLS_99({
        modelValue: (__VLS_ctx.userForm.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    var __VLS_97;
}
var __VLS_71;
{
    const { footer: __VLS_thisSlot } = __VLS_67.slots;
    const __VLS_102 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_106;
    let __VLS_107;
    let __VLS_108;
    const __VLS_109 = {
        onClick: (...[$event]) => {
            __VLS_ctx.dialogVisible = false;
        }
    };
    __VLS_105.slots.default;
    var __VLS_105;
    const __VLS_110 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent(__VLS_110, new __VLS_110({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }));
    const __VLS_112 = __VLS_111({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.saving),
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_114;
    let __VLS_115;
    let __VLS_116;
    const __VLS_117 = {
        onClick: (__VLS_ctx.saveUser)
    };
    __VLS_113.slots.default;
    var __VLS_113;
}
var __VLS_67;
/** @type {__VLS_StyleScopedClasses['user-container']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['page-actions']} */ ;
// @ts-ignore
var __VLS_73 = __VLS_72;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loading: loading,
            saving: saving,
            dialogVisible: dialogVisible,
            dialogType: dialogType,
            formRef: formRef,
            router: router,
            users: users,
            roles: roles,
            userForm: userForm,
            formRules: formRules,
            handleAdd: handleAdd,
            handleEdit: handleEdit,
            formatDate: formatDate,
            saveUser: saveUser,
            handleDelete: handleDelete,
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
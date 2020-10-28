<template>
  <div class="auth">
    <div class="auth-form-wrapper">
      <h2>
        <i class="el-icon-d-arrow-right" />
        后台管理系统
      </h2>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        @submit.native="submit"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            type="text"
            prefix-icon="el-icon-user"
            placeholder="Username..."
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="Password..."
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            native-type="submit"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import qs from 'qs'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['loading', 'error'])
  },
  methods: {
    async submit (e) {
      e.preventDefault()
      if (!await this.$refs.form.validate()) return
      // console.log(this.loading,this.error)
      this.$store.dispatch('user/login', this.form).then(() => {
        this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.auth {
  height: 100vh;
  width: 100vw;

  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-form-wrapper {
  width: 320px;

  // padding: 2rem;
  // box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}

</style>

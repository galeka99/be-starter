import bcrypt from 'bcryptjs'

const BcryptUtil = {
  hash: function (plainText: string): string {
    const salt = bcrypt.genSaltSync(10)

    return bcrypt.hashSync(plainText, salt)
  },

  check: function (plainText: string, hashedValue: string): boolean {
    return bcrypt.compareSync(plainText, hashedValue)
  },
}

export default BcryptUtil

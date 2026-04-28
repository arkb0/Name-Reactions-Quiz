module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/'
}

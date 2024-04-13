/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        mdxRs:true,
        serverComponentsExternalPackages:['mongoose'],
        
    },
    reactStrictMode:false,
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'*'
            },
            {
                protocol:'http',
                hostname:'*'
            }
        ]
    }
}

module.exports = nextConfig

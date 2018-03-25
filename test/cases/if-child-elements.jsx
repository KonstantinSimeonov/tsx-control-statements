export const IfChildElements = ({ shouldRenderLinks }) => (
    <div>
        <h1>useful links</h1>
        <If condition={shouldRenderLinks}>
            <a href="https://wiki.gentoo.org/wiki/Handbook:Main_Page">install gentoo</a>
            <a href="https://github.com">github</a>
        </If>
    </div>
)

export const IfChildExpressions = ({ a, b, shouldRenderExpressions }) => (
    <div>
        <h1>maths</h1>
        <If condition={shouldRenderExpressions}>
            3 + 4 = {3 + 4}
            {a} + {b} = {a + b}
        </If>
    </div>
)

export const IfChildExpressionsAndElements = ({ a, b, shouldRenderStuff }) => (
    <div>
        <h1>maths</h1>
        <If condition={shouldRenderStuff}>
            3 + 4 = {3 + 4}
            <a href="https://wiki.gentoo.org/wiki/Handbook:Main_Page">install gentoo</a>
            <a href="https://github.com">github</a>
            {a} + {b} = {a + b}
        </If>
    </div>
)

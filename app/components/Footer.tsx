import { Card } from 'pixel-retroui';

export function Footer () {
    return (
        <>
            <Card bg="#c381b5" textColor="#000000" borderColor="#000000" shadowColor="#fefcd0">
                <div className='flex justify-between px-20'>
                    <div className='flex'><div>crafted with a lot of patience by&nbsp;</div><div 
                    style={{ marginLeft: "0.4rem" }} className='font-extrabold text-rose-800'>fuyofulo</div></div>
                    <div className='flex gap-28 '>
                        <div><a href='https://x.com/fuyofulo' target='blank' className='social-link'>X</a></div>
                        <div><a href='https://www.instagram.com/fuyofulo/' target='blank' className='social-link'>instagram</a></div>
                        <div><a href='https://www.linkedin.com/in/fuyofulo/' target='blank' className='social-link'>linkedIn</a></div>
                        <div><a href='https://github.com/fuyofulo' target='blank' className='social-link'>github</a></div>
                        
                    </div>
                </div>
            </Card>
        </>
    )
}
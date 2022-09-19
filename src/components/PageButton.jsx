
export default function PageButton(props){

    return (
        <div className="btn">
            <span className={props.isBold ? "pageButtonBold hoverBold" : "hoverBold"}>
                {props.name}
            </span>
        </div>
    )


}
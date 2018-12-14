import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const scores = [
  {
    player: 'Eric Hoffman',
    acc: 55,
    color: '#B54458',
    fill: '#8C3746'
  },
  {
    player: 'Kiel Cummings',
    acc: 28,
    color: '#41E0F0',
    fill: '#2995A3'
  },
  {
    player: 'Siqi Chen',
    acc: 39,
    color: '#DBFF8D',
    fill: '#ABC95D'
  },
  {
    player: 'Dominic Damian',
    acc: 45,
    color: '#6A82C3',
    fill: '#5B43B8'
  },
  {
    player: 'Brian Jowers',
    acc: 34.7,
    color: '#7FE9CB',
    fill: '#41B58E'
  },
  {
    player: 'Arthur Longbottom',
    acc: 40,
    color: '#F5B991',
    fill: '#D87B3A'
  }
]

const calculateBulletPosition = (data, index) => {
  const accuracy = 590 - 590 * (data.acc / 100)
  const dev = 15 * (data.acc / 250) + 15
  let rotation = index * 90 + 45
  let labelPos = 270 - (accuracy - 590)
  let lineLength = (data.acc / -100) * 100 - labelPos * 0.17
  lineLength = lineLength > -58 ? -58 : lineLength < -233 ? -233 : lineLength

  if (scores.length > 4) {
    if (index < 2) {
      index % 2
        ? scores.length === 5
          ? (rotation += 0)
          : index === 1
          ? (rotation += 0)
          : (rotation -= dev)
        : (rotation -= dev)
    } else if (index === 2) {
      scores.length === 5 ? (rotation += 0) : (rotation += dev)
    } else if (index > 3) {
      if (index === 5) {
        rotation -= dev - 90
      } else {
        index % 2 ? (rotation -= dev) : (rotation += dev)
      }
    }
  } else if (scores.length < 3) {
    rotation = index * 180 + 135
  }

  if (scores.length > 2 && [2, 3].some(i => i === index)) {
    labelPos += 150
    lineLength -= 45
  } else if (scores.length === 2 && index === 1) {
    labelPos += 150
    lineLength -= 45
  }

  return [rotation, accuracy, labelPos, lineLength]
}

const App = () => {
  const renderBulletHoles = () => (
    <BulletWrapper>
      {scores.map((data, index) => (
        <BulletHoleComponent key={index} data={data} index={index} />
      ))}
    </BulletWrapper>
  )
  return (
    <AppContainer>
      <TargetWrapper>
        <Target />
        {renderBulletHoles()}
      </TargetWrapper>
    </AppContainer>
  )
}

const BulletHoleComponent = ({ data, index }) => {
  const [rotation, accuracy, labelPos, lineLength] = calculateBulletPosition(
    data,
    index
  )

  return (
    <BulletHole
      key={index}
      data={data}
      style={{
        transform: `rotateZ(${rotation}deg) translate(0px, -${accuracy}%)`
      }}
      innerStyle={{
        transform: `translate(0, -${labelPos}%) rotateZ(-${rotation}deg)`
      }}
      shadowStyle={{
        transform: `rotateZ(-${rotation}deg)`
      }}
      lineLength={lineLength}
    >
      <div className="label">
        <MiniTarget
          innerStyle={{
            stroke: data.color,
            fill: data.fill,
            fillOpacity: 1,
            transform: `rotateZ(${rotation}deg) translate(0px, -${accuracy *
              0.055}%)`
          }}
        />
        <span className="label-1">{Math.round(data.acc)}%</span>
        <span className="label-2">{data.player}</span>
      </div>
    </BulletHole>
  )
}

const UnstyledBulletHole = ({
  data,
  children,
  innerRef,
  innerStyle,
  shadowStyle,
  lineLength,
  ...props
}) => (
  <svg viewBox="-15 -15 30 30" height="5.5%" {...props}>
    <filter
      x="-50%"
      y="-50%"
      width="150%"
      height="150%"
      filterUnits="objectBoundingBox"
      id="inset-shadow"
    >
      <feGaussianBlur
        stdDeviation="2"
        in="SourceAlpha"
        result="shadowBlurInner1"
      />
      <feOffset
        dx="0"
        dy="6"
        in="shadowBlurInner1"
        result="shadowOffsetInner1"
      />
      <feComposite
        in="shadowOffsetInner1"
        in2="SourceAlpha"
        operator="arithmetic"
        k2="-1"
        k3="1"
        result="shadowInnerInner1"
      />
      <feColorMatrix
        values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.6 0"
        type="matrix"
        in="shadowInnerInner1"
      />
    </filter>
    <line
      x1={0}
      y1={lineLength}
      x2="0"
      y2="0"
      stroke="#D1D5E0"
      strokeWidth=".5"
    />
    <circle
      cx={0}
      cy={0}
      r={14}
      stroke={data.color}
      strokeWidth="0.8"
      fill="#1C212F"
    />
    <circle
      cx={0}
      cy={0}
      r={14}
      stroke="transparent"
      strokeWidth="0.8"
      filter="url(#inset-shadow)"
      style={shadowStyle}
    />
    <circle
      cx={0}
      cy={0}
      r={14}
      stroke={data.color}
      strokeWidth="0.8"
      fill="none"
    />
    <foreignObject ref={innerRef} style={innerStyle}>
      {children}
    </foreignObject>
  </svg>
)

const UnstyledMiniTarget = ({ innerStyle, ...props }) => (
  <svg viewBox="-15 -15 30 30" height="100%" {...props}>
    <defs>
      <linearGradient id="mini-line" x1="50%" x2="50%" y1="0%" y2="100%">
        <stop offset="0%" stopColor="#1C212F" stopOpacity="0" />
        <stop offset="50.472%" stopColor="#2B9ABB" />
        <stop offset="100%" stopColor="#1C212F" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="mini-fill"
        x1="56.428%"
        x2="-14.672%"
        y1="9.062%"
        y2="89.222%"
      >
        <stop offset="0%" stopColor="#36CBF3" />
        <stop offset="100%" stopColor="#0F5981" />
      </linearGradient>
    </defs>
    <path fill="url(#mini-line)" d="M .2 -30 L .2 30 L -.2 30 L -.2 -30 z" />
    <path
      fill="url(#mini-line)"
      d="M .2 -30 L .2 30 L -.2 30 L -.2 -30 z"
      transform="rotate(90)"
    />
    <circle
      cx={0}
      cy={0}
      r={14}
      stroke="#1FB0DE"
      strokeWidth="0.5"
      fill="url(#mini-fill)"
      fillOpacity="0.1"
    />
    <circle cx={0} cy={0} r={3} strokeWidth="0.5" style={innerStyle} />
  </svg>
)

const Target = props => (
  <svg viewBox="0 0 870 870" style={{ height: '100%' }} {...props}>
    <defs>
      <linearGradient
        id="prefix__c"
        x1="56.428%"
        x2="-14.672%"
        y1="9.062%"
        y2="89.222%"
      >
        <stop offset="0%" stopColor="#36CBF3" />
        <stop offset="100%" stopColor="#0F5981" />
      </linearGradient>
      <circle id="prefix__b" cx={446} cy={446} r={307} />
      <filter
        id="prefix__a"
        width="121.7%"
        height="121.7%"
        x="-10.8%"
        y="-6.9%"
        filterUnits="objectBoundingBox"
      >
        <feMorphology
          in="SourceAlpha"
          operator="dilate"
          radius={2.5}
          result="shadowSpreadOuter1"
        />
        <feOffset dy={24} in="shadowSpreadOuter1" result="shadowOffsetOuter1" />
        <feGaussianBlur
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
          stdDeviation={16}
        />
        <feComposite
          in="shadowBlurOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowBlurOuter1"
        />
        <feColorMatrix
          in="shadowBlurOuter1"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.221269248 0"
        />
      </filter>
      <linearGradient id="prefix__d" x1="50%" x2="50%" y1="0%" y2="97.857%">
        <stop offset="0%" stopColor="#2EB5E0" stopOpacity={0} />
        <stop offset="49.851%" stopColor="#1FB0DE" />
        <stop offset="100%" stopColor="#1EAEDC" stopOpacity={0} />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g opacity={0.065}>
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M556.808 451.375c3.089-72.796-53.6-134.304-126.616-137.383-73.015-3.078-134.71 53.438-137.799 126.234-3.087 72.795 53.6 134.303 126.616 137.382 73.017 3.079 134.711-53.437 137.799-126.233zm-396.863 2.021l528.512-.8M423.801 188.34l.67 528.512M164.343 499.77l520.516-93.548M377.826 192.339l93.55 520.515m-295.04-169.107l496.13-182.3M333.45 204.732L515.752 701.26M195.926 586.123l456.95-265.854m-361.402-95.948l265.854 456.95m-335.017-57.568l403.78-341.414m-372.197-31.183l341.014 403.78m-339.815 1.199L593.31 249.907m-372.198 33.582L626.89 622.104m-333.817 59.967l262.656-458.55m-360.603 97.947l458.55 262.657M334.65 701.66l179.102-497.328M175.937 363.045l497.328 179.502m-293.84 170.707l90.351-520.915M163.943 407.82l520.916 90.351"
        />
        <path
          stroke="#FEFEFE"
          strokeDasharray="8 8"
          strokeWidth={0.5}
          d="M665.567 488.138c23.272-132.972-65.657-259.633-198.629-282.904-132.972-23.273-259.632 65.657-282.904 198.629-23.272 132.971 65.657 259.632 198.629 282.903 132.972 23.273 259.632-65.656 282.904-198.628z"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M688.856 446.2c0-145.945-118.31-264.256-264.255-264.256-145.944 0-264.256 118.311-264.256 264.256 0 145.945 118.312 264.255 264.256 264.255 145.944 0 264.255-118.31 264.255-264.255zM292.673 179.945v532.91m264.655-530.511v528.511m131.528-396.183H154.748m533.709 263.456H159.945"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M653.276 578.328V314.072L424.401 181.944 195.526 314.072v264.256l228.875 132.127z"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M538.539 511.265V379.936l-113.938-65.664-113.938 65.664v131.329l113.938 65.663z"
        />
        <path
          fill="#FEFEFE"
          d="M426.6 182.144a2.2 2.2 0 1 0-4.399.001 2.2 2.2 0 0 0 4.399 0M197.118 311.97a2.199 2.199 0 1 0-2.784 3.404 2.199 2.199 0 0 0 2.784-3.404m0 264.656a2.199 2.199 0 1 0-2.784 3.403 2.199 2.199 0 0 0 2.784-3.403m229.474 132.727a2.198 2.198 0 1 0-2.784 3.403 2.198 2.198 0 0 0 2.784-3.403m228.675-132.727a2.198 2.198 0 1 0-2.784 3.403 2.198 2.198 0 0 0 2.784-3.403m0-263.456a2.198 2.198 0 1 0-2.784 3.403 2.198 2.198 0 0 0 2.784-3.403"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M539.633 451.048c2.682-63.31-46.555-116.804-109.975-119.481-63.421-2.677-117.007 46.475-119.69 109.785-2.682 63.31 46.556 116.803 109.976 119.48 63.42 2.678 117.007-46.474 119.69-109.784z"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M499.292 449.55c1.744-41.14-30.281-75.902-71.533-77.642-41.25-1.74-76.104 30.2-77.85 71.341-1.744 41.14 30.282 75.902 71.533 77.642 41.25 1.74 76.106-30.2 77.85-71.34z"
        />
        <path
          stroke="#FEFEFE"
          strokeWidth={0.5}
          d="M774.81 446.2c0-193.194-156.616-349.81-349.81-349.81S75.192 253.005 75.192 446.199c0 193.194 156.614 349.809 349.809 349.809 193.194 0 349.808-156.615 349.808-349.81zM426.2 80v32.382m0 667.236V812M792 446.2h-32.382m-667.236 0H60M413.407 80.4l1.2 32.382m23.187 666.436l1.199 32.382M791.6 433.407l-32.382 1.2M92.782 457.794L60.4 458.993M400.214 80.8l2.399 32.382m46.374 665.636l2.4 32.382M791.2 420.214l-32.382 2.399M93.182 468.987l-32.382 2.4M387.82 81.999l3.2 32.382m69.96 663.238l3.2 32.382M790.001 407.82l-32.382 3.2M94.381 480.98L62 484.18M375.028 83.598l4.397 32.382m92.75 660.44l4.397 32.382m312.23-413.774l-32.383 4.397M95.98 492.175l-32.382 4.397M362.635 85.597l5.597 31.982M484.168 774.42l5.597 31.983m296.638-423.768l-31.982 5.597M97.58 504.168l-31.983 5.597M349.842 87.996l6.796 31.982m138.724 652.044l6.796 31.982m281.846-434.162l-31.982 6.796M99.978 515.362l-31.982 6.796M337.448 90.794l7.596 31.583m161.912 646.846l7.596 31.583m266.254-443.358l-31.583 7.596M102.377 526.956l-31.583 7.596m254.661-440.16l8.795 31.183m183.5 640.85l8.795 31.183m251.063-452.153l-31.183 8.795m-640.85 183.5l-31.183 8.795M313.062 97.99l9.994 30.783m206.288 634.454l9.994 30.783M774.01 333.062l-30.783 9.994M108.773 549.344l-30.783 9.994m223.078-457.35l10.794 30.383m228.276 626.858l10.794 30.383m218.68-468.544l-30.383 10.794M112.371 560.138l-30.383 10.794m206.687-464.147l11.993 29.984m249.864 618.462l11.993 29.984m202.69-476.54l-29.984 11.993M116.769 570.532l-29.984 11.993m190.696-470.942l13.593 29.584m270.652 609.666l13.592 29.584m185.099-482.936l-29.584 13.593M121.167 581.726l-29.584 13.592M265.488 116.78l14.392 29.184m292.24 599.672l14.392 29.184M754.82 285.488l-29.184 14.392M125.964 592.12L96.78 606.512m157.514-483.735l15.591 28.784M582.514 740.44l15.592 28.783m151.117-494.929l-28.784 15.591M131.56 602.514l-28.783 15.592M243.1 129.173l16.391 28.385m333.018 577.284l16.391 28.385M743.227 263.1l-28.385 16.391M137.558 612.509L109.173 628.9m123.133-493.33l17.59 27.585m353.007 565.69l17.59 27.585M736.43 252.306l-27.585 17.59m-565.69 353.007l-27.585 17.59m105.542-498.127l18.39 27.185M612.498 722.05l18.39 27.184m98.346-508.122l-27.185 18.39M149.551 632.498l-27.185 18.39m88.352-500.926l19.19 26.385m391.785 539.306l19.19 26.385m81.155-511.32l-26.385 19.19M156.347 641.693l-26.385 19.19m70.761-503.325l19.99 25.586m410.575 525.712l19.989 25.586m63.165-513.719l-25.586 19.99M163.144 651.288l-25.586 19.989m53.171-505.724l21.188 25.186M640.483 701.66l21.188 25.187m45.176-516.118l-25.187 21.188M170.74 660.483l-25.187 21.188m35.581-507.722l21.988 24.386m445.756 495.33l21.988 24.386m27.185-516.917l-24.386 21.988m-495.33 445.756l-24.386 21.988m17.591-508.122l22.787 23.587m463.346 479.338l22.788 23.587m8.795-517.716l-23.587 22.787M186.331 677.673l-23.587 22.788m0-508.921l23.587 22.787m479.338 463.346l23.587 22.788m-8.796-517.717l-22.787 23.587M194.327 685.669l-22.788 23.587m-17.59-508.122l24.386 21.988m495.33 445.756l24.386 21.988m-27.185-516.917l-21.988 24.386m-445.756 495.33l-21.988 24.386m-35.581-507.322l25.186 21.188M681.66 660.483l25.187 21.188m-45.176-516.118l-21.188 25.186M211.917 701.66l-21.188 25.187m-53.171-506.124l25.586 19.99m525.712 410.575l25.586 19.989m-63.165-513.719l-19.99 25.586M220.712 708.856l-19.989 25.586m-70.761-503.724l26.385 19.19m539.306 391.785l26.385 19.19m-81.155-510.921l-19.19 26.385M229.907 715.653l-19.19 26.385m-88.351-500.926l27.185 18.39M702.05 632.498l27.184 18.39m-98.346-508.522l-18.39 27.185M239.502 722.05l-18.39 27.184M115.57 252.306l27.585 17.59m565.69 353.007l27.585 17.59M620.494 135.57l-17.59 27.585m-353.008 565.69l-17.59 27.585M109.173 263.1l28.385 16.391m577.284 333.018l28.385 16.391M608.9 129.173l-16.391 28.385M259.091 734.842l-16.39 28.385M102.777 274.294l28.784 15.591M720.44 602.514l28.783 15.592M598.106 122.777l-15.592 28.784M269.885 740.44l-15.591 28.783M96.78 285.488l29.184 14.392m599.672 292.24l29.184 14.392M586.512 116.78l-14.392 29.184M279.88 745.636l-14.392 29.184M91.583 297.481l29.584 13.593m609.666 270.652l29.584 13.592M575.318 111.583l-13.592 29.584M291.074 750.833l-13.593 29.584M86.785 308.675l29.984 11.993m618.462 249.864l29.984 11.993m-202.69-475.74l-11.993 29.984M300.668 755.231l-11.993 29.984M81.988 321.068l30.383 10.794m626.858 228.276l30.383 10.794m-218.68-468.944l-10.794 30.383M311.862 759.229l-10.794 30.383M77.99 333.062l30.783 9.994m634.454 206.288l30.783 9.994M539.338 97.99l-9.994 30.783M323.056 763.227l-9.994 30.783M74.392 345.455l31.183 8.795m640.85 183.5l31.183 8.795M526.545 94.392l-8.795 31.183m-183.5 640.85l-8.795 31.183M70.794 357.448l31.583 7.596m646.846 161.912l31.583 7.596M514.552 90.794l-7.596 31.583M345.044 769.223l-7.596 31.583M67.996 369.842l31.982 6.796m652.044 138.724l31.982 6.796M502.158 87.996l-6.796 31.982M356.638 772.022l-6.796 31.982M65.597 382.635l31.982 5.597M754.42 504.168l31.983 5.597M489.765 85.597l-5.597 31.982M368.232 774.42l-5.597 31.983M63.598 395.028l32.382 4.397m660.44 92.75l32.382 4.397M476.572 83.598l-4.397 32.382m-92.75 660.44l-4.397 32.382M61.999 407.82l32.382 3.2m663.238 69.96l32.382 3.2M464.18 81.999l-3.2 32.382m-69.96 663.238L387.82 810M60.8 420.214l32.382 2.399m665.636 46.374l32.382 2.4M451.386 80.8l-2.399 32.382m-46.374 665.636l-2.399 32.382M60.4 433.407l32.382 1.2m666.436 23.187l32.382 1.199M438.993 80.4l-1.2 32.382m-23.187 666.436l-1.2 32.382"
        />
      </g>
      <g fillRule="nonzero" transform="translate(-20)">
        <use fill="#000" filter="url(#prefix__a)" xlinkHref="#prefix__b" />
        <use
          fill="url(#prefix__c)"
          fillOpacity={0.24}
          stroke="#1FB0DE"
          xlinkHref="#prefix__b"
        />
        <circle
          cx={446}
          cy={446}
          r={247}
          fill="url(#prefix__c)"
          fillOpacity={0.24}
          stroke="#1FB0DE"
        />
        <circle
          cx={446}
          cy={446}
          r={192}
          fill="url(#prefix__c)"
          fillOpacity={0.24}
          stroke="#1FB0DE"
        />
        <circle
          cx={446}
          cy={446}
          r={137}
          fill="url(#prefix__c)"
          fillOpacity={0.24}
          stroke="#1FB0DE"
        />
        <path
          fill="url(#prefix__c)"
          fillOpacity={0.24}
          stroke="#1FB0DE"
          d="M446 528c-45.287 0-82-36.713-82-82s36.713-82 82-82 82 36.713 82 82-36.713 82-82 82zm0-55c14.912 0 27-12.088 27-27s-12.088-27-27-27-27 12.088-27 27 12.088 27 27 27z"
        />
        <path fill="url(#prefix__d)" fillOpacity={0.61} d="M446 0h1v892h-1z" />
        <path
          fill="url(#prefix__d)"
          fillOpacity={0.61}
          d="M446 0h1v892h-1z"
          transform="rotate(90 446.5 446)"
        />
      </g>
    </g>
  </svg>
)

const AppContainer = styled.div`
  background-color: #1c212f;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const TargetWrapper = styled.div`
  max-height: 1000px;
  height: 100vw;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

const BulletWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-0.95%, 1.2%);
`

const BulletHole = styled(UnstyledBulletHole)`
  position: absolute;
  transform-origin: 50% 50%;
  overflow: visible;

  .label {
    display: flex;
    flex-direction: column;
    position: absolute;
    transform: translate(-8%, -50%);
    width: 150px;

    span {
      font-family: helvetica;
      transform: translateX(25%);
    }

    &-1 {
      color: #ffffff;
      font-size: 12px;
      letter-spacing: 0;
      margin-bottom: 2px;
    }
    &-2 {
      color: #a8b2ce;
      font-size: 7px;
      text-transform: uppercase;
      letter-spacing: 1.77px;
    }
  }
`

const MiniTarget = styled(UnstyledMiniTarget)`
  position: absolute;
  transform-origin: 50% 50%;
  overflow: visible;
  transform: scale(1.6);
`

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)

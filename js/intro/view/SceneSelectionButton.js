// Copyright 2018-2022, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Line, Node, Rectangle } from '../../../../scenery/js/imports.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import SceneMode from '../../common/model/SceneMode.js';
import Spring from '../../common/model/Spring.js';
import OscillatingSpringNode from '../../common/view/OscillatingSpringNode.js';
import massesAndSprings from '../../massesAndSprings.js';

// constants
const IMAGE_SCALE = 0.3;

class SceneSelectionButton extends Node {
  /**
   * @param {string} springLength
   * @param {EnumerationDeprecatedProperty} sceneModeProperty
   * @param {ModelViewTransform2} mvt
   * @param {Tandem} tandem
   */
  constructor( springLength, sceneModeProperty, mvt, tandem ) {

    super( {
      scale: IMAGE_SCALE,
      opacity: 0.9
    } );

    // Springs created to be used in the icons for the scene selection tabs
    const springsIcon = [
      new Spring(
        new Vector2( 0.65, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new NumberProperty( 0 ),
        new NumberProperty( 0 ),
        tandem.createTandem( 'firstIconSpring' )
      ),
      new Spring(
        new Vector2( 0.85, 2.1 ),
        MassesAndSpringsConstants.DEFAULT_SPRING_LENGTH,
        new NumberProperty( 0 ),
        new NumberProperty( 0 ),
        tandem.createTandem( 'secondIconSpring' )
      )
    ];

    // Creation of spring for use in scene switching icons
    const springNodeOptions = {
      frontColor: '#000000',
      middleColor: '#636362',
      backColor: 'black',
      opacity: 0.8
    };
    let firstSpringIcon = new OscillatingSpringNode(
      springsIcon[ 0 ],
      mvt,
      tandem.createTandem( 'firstSpringIcon' ),
      springNodeOptions );
    firstSpringIcon.loopsProperty.set( 6 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    // Creation of spring for use in scene switching icons
    const secondSpringIcon = new OscillatingSpringNode(
      springsIcon[ 1 ],
      mvt,
      tandem.createTandem( 'secondSpringIcon' ),
      springNodeOptions
    );
    secondSpringIcon.loopsProperty.set( 6 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    if ( springLength === SceneMode.ADJUSTABLE_LENGTH ) {
      firstSpringIcon = new OscillatingSpringNode(
        springsIcon[ 0 ],
        mvt,
        tandem.createTandem( 'secondSpringIcon' ),
        springNodeOptions
      );
      firstSpringIcon.loopsProperty.set( 3 );
      firstSpringIcon.lineWidthProperty.set( 3 );
      firstSpringIcon.top = secondSpringIcon.top;
    }

    /**
     * @param {OscillatingSpringNode} springIcon
     *
     * @returns {Line}
     */
    const createVerticalLineNode = springIcon => new Line( 60, 0, 0, 0, {
      stroke: 'black',
      lineWidth: 4,
      centerX: springIcon.centerX,
      top: springIcon.top,
      opacity: 0.8
    } );
    const firstVerticalLineNode = createVerticalLineNode( firstSpringIcon );
    const secondVerticalLineNode = createVerticalLineNode( secondSpringIcon );

    // White background for scene switching icons
    const iconBackground = new Rectangle( firstSpringIcon.left - 20, -170, 180, 170, 10, 10, {
      fill: '#A8D2FF'
    } );

    this.addChild( iconBackground );
    this.addChild( firstSpringIcon );
    this.addChild( firstVerticalLineNode );
    this.addChild( secondSpringIcon );
    this.addChild( secondVerticalLineNode );
  }
}

massesAndSprings.register( 'SceneSelectionButton', SceneSelectionButton );

export default SceneSelectionButton;
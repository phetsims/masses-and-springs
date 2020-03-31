// Copyright 2016-2020, University of Colorado Boulder

/**
 * Common ScreenView for using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import massesAndSpringsStrings from '../../massesAndSpringsStrings.js';
import massesAndSprings from '../../massesAndSprings.js';
import MassesAndSpringsConstants from '../MassesAndSpringsConstants.js';
import MassesAndSpringsColorProfile from './MassesAndSpringsColorProfile.js';
import MovableLineNode from './MovableLineNode.js';
import ReferenceLineNode from './ReferenceLineNode.js';
import SpringHangerNode from './SpringHangerNode.js';
import SpringScreenView from './SpringScreenView.js';

const largeString = massesAndSpringsStrings.large;
const smallString = massesAndSpringsStrings.small;

/**
 * @param {MassesAndSpringsModel} model
 * @param {Tandem} tandem
 * @constructor
 */
function TwoSpringScreenView( model, tandem ) {
  SpringScreenView.call( this, model, tandem );
  const self = this;

  // @public {SpringHangerNode} Spring Hanger Node
  this.springHangerNode = new SpringHangerNode(
    model.springs,
    this.modelViewTransform,
    tandem.createTandem( 'springHangerNode' ) );
  const leftSpring = this.model.firstSpring;
  const rightSpring = this.model.secondSpring;

  // @public {StopperButtonNode}
  this.firstSpringStopperButtonNode = this.createStopperButton( leftSpring, tandem );
  this.firstSpringStopperButtonNode.right = this.springHangerNode.left - this.spacing;

  // @public {StopperButtonNode}
  this.secondSpringStopperButtonNode = this.createStopperButton( rightSpring, tandem );
  this.secondSpringStopperButtonNode.left = this.springHangerNode.right + this.spacing;

  leftSpring.buttonEnabledProperty.link( function( enabled ) {
    self.firstSpringStopperButtonNode.enabled = enabled;
  } );

  rightSpring.buttonEnabledProperty.link( function( enabled ) {
    self.secondSpringStopperButtonNode.enabled = enabled;
  } );

  // Spring Constant Control Panels
  const minMaxLabels = [
    new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } ),
    new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT, maxWidth: 40 } )
  ];

  // @public {SpringConstantPanel}
  this.firstSpringConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );
  this.firstSpringConstantControlPanel.right = this.firstSpringStopperButtonNode.left - this.spacing;

  // @public {SpringConstantPanel}
  this.secondSpringConstantControlPanel = this.createSpringConstantPanel( 1, minMaxLabels, tandem );
  this.secondSpringConstantControlPanel.left = this.secondSpringStopperButtonNode.right + this.spacing;

  const xBoundsLimit = this.springHangerNode.centerX + 5;

  // @public {MovableLineNode} Initializes red movable reference line
  this.movableLineNode = new MovableLineNode(
    this.visibleBoundsProperty.value.center.minus( new Vector2( 45, 0 ) ),
    210,
    model.movableLineVisibleProperty,
    new Bounds2( xBoundsLimit, 55, xBoundsLimit, 600 ),
    tandem.createTandem( 'movableLineNode' )
  );

  /**
   * @param {Spring} spring
   * @returns {ReferenceLineNode}
   */
  const createNaturalLineNode = function( spring ) {
    return new ReferenceLineNode(
      self.modelViewTransform,
      spring,
      spring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: MassesAndSpringsColorProfile.unstretchedLengthProperty, // Naming convention pulled from basics version.
        fixedPosition: true
      }
    );
  };

  // @public {ReferenceLineNode} Initializes natural line for springs
  this.firstNaturalLengthLineNode = createNaturalLineNode( model.firstSpring );
  this.secondNaturalLengthLineNode = createNaturalLineNode( model.secondSpring );

  this.resetAllButton.addListener( function() {
    self.movableLineNode.reset();
  } );

  // @public {HBox} Contains Panels/Nodes that hover near the spring system at the center of the screen.
  this.springSystemControlsNode = new HBox( {
    children: [
      this.firstSpringConstantControlPanel,
      this.firstSpringStopperButtonNode,
      this.springHangerNode,
      this.secondSpringStopperButtonNode,
      this.secondSpringConstantControlPanel
    ],
    spacing: this.spacing,
    align: 'top'
  } );

  // Adjust the floating panels to the visibleBounds of the screen.
  this.visibleBoundsProperty.link( function( visibleBounds ) {
    self.adjustViewComponents( false, visibleBounds );
  } );
}

massesAndSprings.register( 'TwoSpringScreenView', TwoSpringScreenView );

inherit( SpringScreenView, TwoSpringScreenView );
export default TwoSpringScreenView;
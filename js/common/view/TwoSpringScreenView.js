// Copyright 2016-2019, University of Colorado Boulder

/**
 * Common ScreenView for using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsColorProfile = require( 'MASSES_AND_SPRINGS/common/view/MassesAndSpringsColorProfile' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  const ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  const SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  const SpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/SpringScreenView' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );


  // strings
  const largeString = require( 'string!MASSES_AND_SPRINGS/large' );
  const smallString = require( 'string!MASSES_AND_SPRINGS/small' );

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

    // {number} Used in determining springSystemControlsNode's placement
    const distanceBetweenSprings = (self.modelViewTransform.modelToViewX(
      model.firstSpring.positionProperty.value.distance( model.secondSpring.positionProperty.value ) ) / 2);
    const leftSpringXPosition = self.modelViewTransform.modelToViewX( model.firstSpring.positionProperty.value.x );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      // Update the bounds of view elements
      self.panelRightSpacing = visibleBounds.right - self.spacing;

      // Alignment of layout
      self.springSystemControlsNode.x = leftSpringXPosition + distanceBetweenSprings - self.springHangerNode.centerX;
      self.springSystemControlsNode.top = self.spacing;
      self.simControlHBox.rightBottom = new Vector2( self.panelRightSpacing, self.shelf.bottom );

      // Adjusting drag bounds of draggable objects based on visible bounds.
      self.timerNode.timerNodeMovableDragHandler.dragBounds = visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      );
      self.rulerNode.rulerNodeMovableDragHandler.dragBounds = visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      );
      self.massNodes.forEach( function( massNode ) {
        if ( massNode.centerX > visibleBounds.maxX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.maxX ), massNode.mass.positionProperty.get().y )
          );
        }
        if ( massNode.centerX < visibleBounds.minX ) {
          massNode.mass.positionProperty.set(
            new Vector2( self.modelViewTransform.viewToModelX( visibleBounds.minX ), massNode.mass.positionProperty.get().y )
          );
        }
      } );
    } );
  }

  massesAndSprings.register( 'TwoSpringScreenView', TwoSpringScreenView );

  return inherit( SpringScreenView, TwoSpringScreenView );
} );
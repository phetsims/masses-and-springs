// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common ScreenView for  using two masses.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var MovableLineNode = require( 'MASSES_AND_SPRINGS/common/view/MovableLineNode' );
  var ReferenceLineNode = require( 'MASSES_AND_SPRINGS/common/view/ReferenceLineNode' );
  var Property = require( 'AXON/Property' );
  var SpringHangerNode = require( 'MASSES_AND_SPRINGS/common/view/SpringHangerNode' );
  var SpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/SpringScreenView' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var NATURAL_LENGTH_LINE_FILL = 'rgb( 65, 66, 232 )';

  // strings
  var largeString = require( 'string!MASSES_AND_SPRINGS/large' );
  var smallString = require( 'string!MASSES_AND_SPRINGS/small' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function TwoSpringView( model, tandem ) {
    this.model = model; // Make model available
    SpringScreenView.call( this, model, tandem );
    var self = this;

    model.springs[ 0 ].options.modelViewTransform2 = this.modelViewTransform;
    model.springs[ 1 ].options.modelViewTransform2 = this.modelViewTransform;

    // Spring Hanger Node
    this.springHangerNode = new SpringHangerNode(
      model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ), {
        centerX: this.modelViewTransform.modelToViewX(
          model.springs[ 0 ].positionProperty.value.distance( model.springs[ 1 ].positionProperty.value ) ) * 4.7
      } );


    var leftSpring = this.model.springs[ 0 ];
    this.firstSpringStopperButtonNode = this.createStopperButton( leftSpring, tandem );
    this.firstSpringStopperButtonNode.right = this.springHangerNode.left - this.spacing;

    var rightSpring = this.model.springs[ 1 ];
    this.secondSpringStopperButtonNode = this.createStopperButton( rightSpring, tandem );
    this.secondSpringStopperButtonNode.left = this.springHangerNode.right + this.spacing;

    Property.multilink( [ leftSpring.buttonEnabledProperty, rightSpring.buttonEnabledProperty ],
      function( leftButtonEnabled, rightButtonEnabled ) {
        self.firstSpringStopperButtonNode.enabled = leftButtonEnabled;
        self.secondSpringStopperButtonNode.enabled = rightButtonEnabled;
      } );

    // Spring Constant Control Panels
    var minMaxLabels = [
      new Text( smallString, { font: MassesAndSpringsConstants.LABEL_FONT } ),
      new Text( largeString, { font: MassesAndSpringsConstants.LABEL_FONT } )
    ];
    this.firstSpringConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );
    this.firstSpringConstantControlPanel.right = this.firstSpringStopperButtonNode.left - this.spacing;

    this.secondSpringConstantControlPanel = this.createSpringConstantPanel( 1, minMaxLabels, tandem );
    this.secondSpringConstantControlPanel.left = this.secondSpringStopperButtonNode.right + this.spacing;

    // Initializes red movable reference line
    var xBoundsLimit = this.springHangerNode.centerX + 5;
    var movableLineNode = new MovableLineNode(
      this.visibleBoundsProperty.get().getCenter().minus( new Vector2( 45, 0 ) ),
      210,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 55, xBoundsLimit, 600 ),
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes natural line for first spring
    var firstNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 0 ],
      model.springs[ 0 ].bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // @public Initializes natural line for second spring
    var secondNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.springs[ 1 ],
      model.springs[ 1 ].bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // Gravity Control Panel
    this.gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ),
      {
        right: this.rightPanelAlignment,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false
      }
    );

    // Adding all of the nodes to the scene graph
    this.addChild( this.springHangerNode );

    // Adding Panels to scene graph
    this.addChild( this.firstSpringConstantControlPanel );
    this.addChild( this.secondSpringConstantControlPanel );

    // Adding Buttons to scene graph
    this.addChild( this.resetAllButton );
    this.addChild( this.timeControlPanel );
    this.addChild( this.firstSpringStopperButtonNode );
    this.addChild( this.secondSpringStopperButtonNode );

    //Reference lines from indicator visibility box
    this.addChild( firstNaturalLengthLineNode );
    this.addChild( secondNaturalLengthLineNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {

      //Update the bounds of view elements
      self.springHangerNode.top = model.springs[ 0 ].positionProperty.value.y + self.spacing;
      self.gravityAndDampingControlNode.right = self.panelRightSpacing;
      self.toolboxPanel.right = self.panelRightSpacing;
      self.resetAllButton.right = self.panelRightSpacing;
      self.timeControlPanel.right = self.resetAllButton.left - self.spacing * 6;
      self.toolboxPanel.dragBounds = 3;
      self.timerNode.updateBounds( visibleBounds.withOffsets(
        self.timerNode.width / 2, self.timerNode.height / 2, -self.timerNode.width / 2, -self.timerNode.height / 2
      ) );
      self.rulerNode.updateBounds( visibleBounds.withOffsets(
        -self.rulerNode.width / 2, self.rulerNode.height / 2, self.rulerNode.width / 2, -self.rulerNode.height / 2
      ) );
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

  massesAndSprings.register( 'TwoSpringView', TwoSpringView );

  return inherit( SpringScreenView, TwoSpringView );
} );
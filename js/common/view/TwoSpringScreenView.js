// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common ScreenView for using two masses.
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
  function TwoSpringScreenView( model, tandem ) {
    SpringScreenView.call( this, model, tandem );
    var self = this;

    // Spring Hanger Node
    //REVIEW: JSDoc
    this.springHangerNode = new SpringHangerNode(
      model.springs,
      this.modelViewTransform,
      tandem.createTandem( 'springHangerNode' ), {
        centerX: this.modelViewTransform.modelToViewX(
          model.firstSpring.positionProperty.value.distance( model.secondSpring.positionProperty.value ) ) * 4.7
      } );


    var leftSpring = this.model.firstSpring;
    //REVIEW: JSDoc
    this.firstSpringStopperButtonNode = this.createStopperButton( leftSpring, tandem );
    this.firstSpringStopperButtonNode.right = this.springHangerNode.left - this.spacing;

    var rightSpring = this.model.secondSpring;
    //REVIEW: JSDoc
    this.secondSpringStopperButtonNode = this.createStopperButton( rightSpring, tandem );
    this.secondSpringStopperButtonNode.left = this.springHangerNode.right + this.spacing;

    //REVIEW: Not sure why these two Properties are linked together. This looks like it could be handled with two
    //REVIEW: separate link statements?
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
    //REVIEW: JSDoc
    this.firstSpringConstantControlPanel = this.createSpringConstantPanel( 0, minMaxLabels, tandem );
    this.firstSpringConstantControlPanel.right = this.firstSpringStopperButtonNode.left - this.spacing;

    //REVIEW: JSDoc
    this.secondSpringConstantControlPanel = this.createSpringConstantPanel( 1, minMaxLabels, tandem );
    this.secondSpringConstantControlPanel.left = this.secondSpringStopperButtonNode.right + this.spacing;

    // Initializes red movable reference line
    var xBoundsLimit = this.springHangerNode.centerX + 5;
    var movableLineNode = new MovableLineNode(
      //REVIEW: If it's easier, you can use .center instead of .getCenter(), as it's slightly shorter
      this.visibleBoundsProperty.get().getCenter().minus( new Vector2( 45, 0 ) ),
      210,
      model.movableLineVisibleProperty,
      new Bounds2( xBoundsLimit, 55, xBoundsLimit, 600 ),
      tandem.createTandem( 'movableLineNode' )
    );

    // @public Initializes natural line for first spring
    //REVIEW: Don't need visibility doc for local variable
    //REVIEW: Lots of duplication with construction of these. Can we simplify?
    var firstNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.firstSpring,
      model.firstSpring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // @public Initializes natural line for second spring
    //REVIEW: Don't need visibility doc for local variable
    var secondNaturalLengthLineNode = new ReferenceLineNode(
      this.modelViewTransform,
      model.secondSpring,
      model.secondSpring.bottomProperty,
      model.naturalLengthVisibleProperty, {
        stroke: NATURAL_LENGTH_LINE_FILL,
        fixedPosition: true
      }
    );

    // Gravity Control Panel
    //REVIEW: JSDoc
    this.gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ),
      {
        right: this.rightPanelPadding,
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false
      }
    );

    this.resetAllButton.addListener( function() {
      movableLineNode.reset();
    } );

    // Adding all of the nodes to the scene graph
    this.addChild( this.springHangerNode );

    // Adding Panels to scene graph
    this.addChild( this.firstSpringConstantControlPanel );
    this.addChild( this.secondSpringConstantControlPanel );

    // Adding Buttons to scene graph
    this.addChild( this.timeControlPanel );
    this.addChild( this.firstSpringStopperButtonNode );
    this.addChild( this.secondSpringStopperButtonNode );

    //REVIEW: Style guide wants one space after //
    //Reference lines from indicator visibility box
    this.addChild( firstNaturalLengthLineNode );
    this.addChild( secondNaturalLengthLineNode );
    this.addChild( movableLineNode );
    this.addChild( this.massLayer );
    this.addChild( this.toolsLayer );

    this.addChild( this.resetAllButton );

    // Adjust the floating panels to the visibleBounds of the screen.
    this.visibleBoundsProperty.link( function( visibleBounds ) {
      // Update the bounds of view elements
      //REVIEW: Lots of layout here. Can we use things like AlignBox/HBox/VBox to simplify? Might be worth collaboration.
      //REVIEW: How much of this can be shared with OneSpringScreenView (and moved to SpringScreenView?)
      self.springHangerNode.top = model.firstSpring.positionProperty.value.y + self.spacing;
      self.gravityAndDampingControlNode.right = self.panelRightSpacing;
      self.toolboxPanel.right = self.panelRightSpacing;
      self.resetAllButton.right = self.panelRightSpacing;
      self.timeControlPanel.right = self.resetAllButton.left - self.spacing * 6;
      self.toolboxPanel.dragBounds = 3; //REVIEW: Is this setting a {number} to a {Bounds2}?
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
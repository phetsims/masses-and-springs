// Copyright 2016-2018, University of Colorado Boulder

/**
 * Common screen view for vectors screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var IndicatorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/IndicatorVisibilityControlPanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var GravityAndDampingControlPanel = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlPanel' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );
  var Panel = require( 'SUN/Panel' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VectorVisibilityControlPanel = require( 'MASSES_AND_SPRINGS/vectors/view/VectorVisibilityControlPanel' );
  var DisplacementArrowNode = require( 'MASSES_AND_SPRINGS/vectors/view/DisplacementArrowNode' );

  /**
   * @param {VectorsModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function VectorsScreenView( model, tandem ) {

    // Calls common two spring view
    TwoSpringView.call( this, model, tandem );
    var self = this;

    this.massNodes.forEach( function( massNode ) {
      massNode.vectorViewEnabled = true;
    } );

    // Displacement arrows added for each springs
    var firstDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 0 ].spring.displacementProperty,
      model.displacementVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    firstDisplacementArrowNode.left = this.springNodes[ 0 ].right;
    firstDisplacementArrowNode.top = this.springNodes[ 0 ].bottom;
    this.addChild( firstDisplacementArrowNode );

    var secondDisplacementArrowNode = new DisplacementArrowNode(
      this.springNodes[ 1 ].spring.displacementProperty,
      model.displacementVisibleProperty,
      tandem,
      { modelViewTransform: this.modelViewTransform } );
    secondDisplacementArrowNode.right = this.springNodes[ 1 ].left + secondDisplacementArrowNode.width / 2;
    secondDisplacementArrowNode.top = this.springNodes[ 1 ].bottom;
    this.addChild( secondDisplacementArrowNode );

    // Contains visibility options for the reference lines and displacement arrow
    var indicatorVisibilityControlPanel = new IndicatorVisibilityControlPanel(
      model,
      tandem.createTandem( 'indicatorVisibilityControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // Contains all of the display options for the vectors and forces
    var vectorVisibilityControlPanel = new VectorVisibilityControlPanel(
      model,
      tandem.createTandem( 'vectorVisibilityControlPanel' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // Gravity Control Panel
    var gravityAndDampingControlPanel = new GravityAndDampingControlPanel(
      model, this, tandem.createTandem( 'gravityAndDampingControlPanel' ), {
        minWidth: 1,
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: false,
        xMargin: 0,
        yMargin: 0,
        stroke: null
      } );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlPanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        gravityAndDampingControlPanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        vectorVisibilityControlPanel,
        MassesAndSpringsConstants.LINE_SEPARATOR(),
        this.toolboxPanel
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = new Panel(
      optionsVBox,
      {
        xMargin: 10,
        fill: MassesAndSpringsConstants.PANEL_FILL,
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'ReferenceLinePanel' ),
        minWidth: MassesAndSpringsConstants.PANEL_MIN_WIDTH
      } );
    this.addChild( optionsPanel );
    optionsPanel.moveToBack();

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      optionsPanel.top = self.secondSpringConstantControlPanel.top + self.spacing;
      optionsPanel.right = visibleBounds.right - self.spacing;
    } );
    this.gravityAndDampingControlPanel.gravityNumberDisplay.visible = false;

    // Determines where we want the force vectors of the attached mass to be placed.
    model.springs[ 0 ].options.forcesOrientation = -1;
    model.springs[ 1 ].options.forcesOrientation = 1;
  }

  massesAndSprings.register( 'VectorsScreenView', VectorsScreenView );

  return inherit( TwoSpringView, VectorsScreenView );
} );
